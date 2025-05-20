// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import lensService from '@/services/lens.service';
import User, { UserRoleType } from '@/models/User.model'; // Import the Sequelize User model and types
import { UniqueConstraintError } from 'sequelize'; // Import Sequelize error type

interface VerifyWalletRequestBody {
  walletAddress: string;
  role: UserRoleType; // Expect 'creator' or 'consumer'
  fullName?: string;
  bio?: string;
  email?: string;
  avatarUrl?: string;
  website?: string;
  twitterHandle?: string;
}

class AuthController {
  /**
   * Verifies a wallet address, processes the selected role, creates/updates user in DB (PostgreSQL/Sequelize),
   * and fetches associated profile (e.g., Lens profile).
   */
  async verifyWalletAndGetProfile(req: Request, res: Response): Promise<void> {
    const {
        walletAddress,
        role,
        fullName,
        bio,
        email,
        avatarUrl,
        website,
        twitterHandle
    } = req.body as VerifyWalletRequestBody;

    if (!walletAddress || !role) {
      res.status(400).json({ message: 'Wallet address and role are required.' });
      return;
    }

    if (role !== 'creator' && role !== 'consumer') {
      res.status(400).json({ message: 'Invalid role specified. Must be "creator" or "consumer".' });
      return;
    }

    const lowercasedWalletAddress = walletAddress.toLowerCase();

    try {
      console.log(`AuthController: Verifying wallet ${lowercasedWalletAddress} with role ${role}`);

      // Database Interaction with Sequelize: Find existing user or create a new one
      let user: User | null = await User.findOne({ where: { walletAddress: lowercasedWalletAddress } });
      let isNewUser = false;

      const userDataToUpdateOrCreate = {
        role,
        fullName: fullName !== undefined ? fullName : user?.fullName, // Preserve existing if not provided
        bio: bio !== undefined ? bio : user?.bio,
        email: email !== undefined ? email : user?.email,
        avatarUrl: avatarUrl !== undefined ? avatarUrl : user?.avatarUrl,
        website: website !== undefined ? website : user?.website,
        twitterHandle: twitterHandle !== undefined ? twitterHandle : user?.twitterHandle,
      };

      if (user) {
        // User exists. Update their information.
        console.log(`AuthController: Existing user found: ${user.walletAddress}, current role: ${user.role}`);
        await user.update(userDataToUpdateOrCreate);
        // After update, Sequelize 'user' instance is updated in place.
        console.log(`AuthController: Existing user ${lowercasedWalletAddress} data updated. Role set to ${role}.`);
      } else {
        // New user. Create a record.
        isNewUser = true;
        user = await User.create({
          walletAddress: lowercasedWalletAddress,
          ...userDataToUpdateOrCreate
        });
        console.log(`AuthController: New user ${lowercasedWalletAddress} created with role ${role}.`);
      }

      // Fetch Lens profile for the address
      const lensProfile = await lensService.getProfileByAddress(lowercasedWalletAddress);

      // If a Lens profile is found, update our user record with Lens info
      if (lensProfile && user) { // ensure user is not null
        const lensDataToUpdate: Partial<User> = {}; // Use Partial<User> for update object
        let userChangedByLensData = false;

        if (lensProfile.id && user.lensProfileId !== lensProfile.id) {
            lensDataToUpdate.lensProfileId = lensProfile.id;
            userChangedByLensData = true;
        }
        const currentLensHandle = lensProfile.handle?.fullHandle || lensProfile.handle?.localName;
        if (currentLensHandle && user.lensHandle !== currentLensHandle) {
            lensDataToUpdate.lensHandle = currentLensHandle;
            userChangedByLensData = true;
        }

        if (!user.fullName && lensProfile.metadata?.displayName) {
            lensDataToUpdate.fullName = lensProfile.metadata.displayName;
            userChangedByLensData = true;
        }
        if (!user.bio && lensProfile.metadata?.bio) {
            lensDataToUpdate.bio = lensProfile.metadata.bio;
            userChangedByLensData = true;
        }

        const lensPicture = lensProfile.metadata?.picture;
        let lensAvatarUrl = null;
        if (typeof lensPicture === 'object' && lensPicture !== null) {
            const pictureDetails = lensPicture as any;
            if (pictureDetails.original?.url) {
                lensAvatarUrl = pictureDetails.original.url;
            } else if (pictureDetails.uri) {
                lensAvatarUrl = pictureDetails.uri;
            } else if (pictureDetails.url) {
                lensAvatarUrl = pictureDetails.url;
            }
        }
        if (!user.avatarUrl && lensAvatarUrl) {
            lensDataToUpdate.avatarUrl = lensAvatarUrl;
            userChangedByLensData = true;
        }

        if (userChangedByLensData) {
            await user.update(lensDataToUpdate); // user instance is updated
            console.log(`AuthController: User record for ${lowercasedWalletAddress} updated with Lens profile data.`);
        }
      }

      if (!user) {
        // This case should be rare if create/update logic is sound
        res.status(500).json({ message: "User record could not be established or found after DB operations." });
        return; // Explicit return
      }

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
        isNewUser: isNewUser,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      const responseMessageBase = isNewUser
        ? 'New user created, wallet verified, role processed.'
        : 'Existing user data updated, wallet verified, role processed.';

      const finalResponseMessage = lensProfile
        ? `${responseMessageBase} Lens profile fetched.`
        : `${responseMessageBase} No Lens profile found.`;

      res.status(isNewUser ? 201 : 200).json({
        message: finalResponseMessage,
        user: userResponseData,
        lensProfile: lensProfile ? {
            id: lensProfile.id,
            handle: lensProfile.handle?.fullHandle || lensProfile.handle?.localName,
            ownedBy: lensProfile.ownedBy.address,
            stats: lensProfile.stats,
        } : null,
      });
      return; // Explicit return
    } catch (error: any) {
      console.error('Error in verifyWalletAndGetProfile:', error);
      if (error instanceof UniqueConstraintError) {
        const fields = error.fields && typeof error.fields === 'object' ? Object.keys(error.fields).join(', ') : 'unknown field(s)';
        res.status(409).json({ message: `Conflict: A user with this ${fields} already exists.`, error: error.message });
        return; // Explicit return
      }
      res.status(500).json({ message: 'Server error during wallet verification or profile processing.', error: error.message });
      return; // Explicit return
    }
  }
}

export default new AuthController();
