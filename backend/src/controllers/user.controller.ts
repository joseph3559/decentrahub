// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import lensService from '@/services/lens.service';
import User from '@/models/User.model'; // Sequelize User model
import { UniqueConstraintError } from 'sequelize';

// Define expected payload for profile update
interface UpdateProfileRequestBody {
  fullName?: string | null;
  // username is usually not updatable or handled via specific process (e.g., Lens handle change)
  bio?: string | null;
  email?: string | null; // Consider email verification if changed
  website?: string | null;
  twitterHandle?: string | null;
  avatarUrl?: string | null;
}

class UserController {
  /**
   * Fetches a user's public profile information by identifier (address or handle).
   */
  async getUserProfile(req: Request, res: Response): Promise<void> {
    const { identifier } = req.params;

    if (!identifier) {
      res.status(400).json({ message: 'User identifier (address or handle) is required.' });
      return;
    }
    try {
      let userRecord = null;
      let lensProfileData = null;

      if (identifier.match(/^0x[a-fA-F0-9]{40}$/)) { // Wallet address
        userRecord = await User.findOne({ where: { walletAddress: identifier.toLowerCase() } });
        if (userRecord) {
            lensProfileData = userRecord.lensProfileId
                ? await lensService.getProfileByHandle(userRecord.lensHandle || userRecord.lensProfileId) // Prefer handle if available
                : await lensService.getProfileByAddress(identifier);
        } else {
            // No record in our DB, try fetching Lens profile directly by address
             lensProfileData = await lensService.getProfileByAddress(identifier);
        }
      } else if (identifier.match(/^[\w.-]+\.(lens|test|eth)$/i)) { // Lens handle
        lensProfileData = await lensService.getProfileByHandle(identifier);
        if (lensProfileData) {
            userRecord = await User.findOne({ where: { lensProfileId: lensProfileData.id }});
            // If no userRecord by lensProfileId, try by ownedBy address as fallback
            if (!userRecord && lensProfileData.ownedBy?.address) {
                 userRecord = await User.findOne({ where: { walletAddress: lensProfileData.ownedBy.address.toLowerCase() } });
            }
        }
      } else {
        res.status(400).json({ message: 'Invalid identifier format. Must be a Lens handle or wallet address.' });
        return;
      }

      if (!userRecord && !lensProfileData) {
        res.status(404).json({ message: 'User profile not found.' });
        return;
      }

      // Construct response, prioritizing DB data and supplementing with Lens if needed
      const profileResponse = {
        userId: userRecord?.id,
        address: userRecord?.walletAddress || lensProfileData?.ownedBy?.address,
        role: userRecord?.role,
        fullName: userRecord?.fullName || lensProfileData?.metadata?.displayName,
        bio: userRecord?.bio || lensProfileData?.metadata?.bio,
        email: userRecord?.email, // Email is from our DB
        avatarUrl: userRecord?.avatarUrl || (lensProfileData?.metadata?.picture as any)?.original?.url || (lensProfileData?.metadata?.picture as any)?.uri,
        website: userRecord?.website,
        twitterHandle: userRecord?.twitterHandle,
        lensProfileId: userRecord?.lensProfileId || lensProfileData?.id,
        lensHandle: userRecord?.lensHandle || lensProfileData?.handle?.fullHandle || lensProfileData?.handle?.localName,
        lensStats: lensProfileData?.stats,
        createdAt: userRecord?.createdAt,
        updatedAt: userRecord?.updatedAt,
      };

      res.status(200).json({
        message: 'User profile fetched successfully.',
        profile: profileResponse,
      });

    } catch (error: any) {
      console.error(`Error fetching user profile for ${identifier}:`, error);
      res.status(500).json({ message: 'Error fetching user profile.', error: error.message });
      return;
    }
  }

  /**
   * Fetches the profile of the currently authenticated user.
   * Assumes `req.user` is populated by an authentication middleware with at least `userId`.
   */
  async getCurrentAuthenticatedUserProfile(req: Request, res: Response): Promise<void> {
    // @ts-ignore // Assuming req.user will be populated by auth middleware
    const authenticatedUserId = req.user?.userId; // Or req.user.id, depending on your auth middleware

    if (!authenticatedUserId) {
      res.status(401).json({ message: 'Authentication required.' });
      return;
    }

    try {
      const user = await User.findByPk(authenticatedUserId);
      if (!user) {
        res.status(404).json({ message: 'Authenticated user profile not found.' });
        return;
      }
      // You might want to fetch fresh Lens data here too if needed
      // const lensProfile = user.lensProfileId ? await lensService.getProfileByHandle(user.lensHandle || user.lensProfileId) : null;

      const userResponseData = {
        userId: user.id,
        address: user.walletAddress,
        role: user.role,
        fullName: user.fullName,
        bio: user.bio,
        email: user.email,
        avatarUrl: user.avatarUrl,
        website: user.website,
        twitterHandle: user.twitterHandle,
        lensProfileId: user.lensProfileId,
        lensHandle: user.lensHandle,
        isNewUser: false, // Not relevant for fetching existing profile
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      res.status(200).json({
        message: 'Authenticated user profile fetched successfully.',
        user: userResponseData,
        // lensProfile: lensProfile ? { id: lensProfile.id, handle: lensProfile.handle?.fullHandle, stats: lensProfile.stats } : null,
      });
      return;
    } catch (error: any) {
      console.error(`Error fetching profile for authenticated user ${authenticatedUserId}:`, error);
      res.status(500).json({ message: 'Error fetching user profile.', error: error.message });
      return;
    }
  }


  /**
   * Updates the profile of the currently authenticated user.
   * Assumes `req.user` is populated by an authentication middleware with `userId`.
   */
  async updateCurrentAuthenticatedUserProfile(req: Request, res: Response): Promise<void> {
    // @ts-ignore // Assuming req.user will be populated by auth middleware
    const authenticatedUserId = req.user?.userId; // Or req.user.id, depending on your auth middleware
    const updateData = req.body as UpdateProfileRequestBody;

    if (!authenticatedUserId) {
      res.status(401).json({ message: 'Authentication required to update profile.' });
      return;
    }

    // Remove fields that shouldn't be directly updatable or are handled elsewhere (like username/Lens handle)
    const allowedUpdates: Partial<UpdateProfileRequestBody> = {};
    if (updateData.fullName !== undefined) allowedUpdates.fullName = updateData.fullName;
    if (updateData.bio !== undefined) allowedUpdates.bio = updateData.bio;
    if (updateData.email !== undefined) allowedUpdates.email = updateData.email; // Consider email verification
    if (updateData.website !== undefined) allowedUpdates.website = updateData.website;
    if (updateData.twitterHandle !== undefined) allowedUpdates.twitterHandle = updateData.twitterHandle;
    if (updateData.avatarUrl !== undefined) allowedUpdates.avatarUrl = updateData.avatarUrl;


    if (Object.keys(allowedUpdates).length === 0) {
        res.status(400).json({ message: 'No valid fields provided for update.' });
        return;
    }

    try {
      const user = await User.findByPk(authenticatedUserId);
      if (!user) {
        res.status(404).json({ message: 'User not found. Cannot update profile.' });
        return;
      }

      await user.update(allowedUpdates);
      console.log(`User profile updated for userId: ${authenticatedUserId}`);

      // Return the updated user object (same structure as verifyWallet response for consistency)
      const updatedUserResponse = {
        userId: user.id,
        address: user.walletAddress,
        role: user.role,
        fullName: user.fullName,
        bio: user.bio,
        email: user.email,
        avatarUrl: user.avatarUrl,
        website: user.website,
        twitterHandle: user.twitterHandle,
        lensProfileId: user.lensProfileId,
        lensHandle: user.lensHandle,
        isNewUser: false, // It's an update
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      res.status(200).json({
        message: 'Profile updated successfully.',
        user: updatedUserResponse,
      });
      return;
    } catch (error: any) {
      console.error(`Error updating profile for userId ${authenticatedUserId}:`, error);
       if (error instanceof UniqueConstraintError) {
        const fields = error.fields && typeof error.fields === 'object' ? Object.keys(error.fields).join(', ') : 'unknown field(s)';
        res.status(409).json({ message: `Conflict: Update violates unique constraint on ${fields}.`, error: error.message });
        return;
      }
      res.status(500).json({ message: 'Error updating profile.', error: error.message });
      return;
    }
  }
}

export default new UserController();
