// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import lensService from '@/services/lens.service'; // Ensure this path is correct
// import db models if you store user data, e.g., import User from '@/models/User.model';

class UserController {
  /**
   * Fetches a user's public profile information.
   * This could be a combination of Lens profile and any off-chain data.
   */
  async getUserProfile(req: Request, res: Response): Promise<void> {
    const { identifier } = req.params; // Can be a wallet address or Lens handle

    if (!identifier) {
      res.status(400).json({ message: 'User identifier (address or handle) is required.' });
      return;
    }

    try {
      let lensProfile;
      // Basic check for handle format (adjust regex if needed for specific Lens handle formats)
      if (identifier.match(/^[\w.-]+\.(lens|test|eth)$/i)) {
        lensProfile = await lensService.getProfileByHandle(identifier);
      } else if (identifier.match(/^0x[a-fA-F0-9]{40}$/)) { // Basic check for address format
        lensProfile = await lensService.getProfileByAddress(identifier);
      } else {
        res.status(400).json({ message: 'Invalid identifier format. Must be a Lens handle or wallet address.' });
        return;
      }

      if (!lensProfile) {
        res.status(404).json({ message: 'User profile not found.' });
        return;
      }

      // TODO: Combine with any off-chain user data if you have a database
      // For now, just returning Lens profile details
      // Ensure the structure of lensProfile.metadata and its picture objects are handled safely
      const picture = lensProfile.metadata?.picture;
      let pictureUrl = null;
      if (typeof picture === 'object' && picture !== null) {
        // Check for different possible structures of picture metadata from Lens
        if ('optimized' in picture && (picture as any).optimized?.uri) {
            pictureUrl = (picture as any).optimized.uri;
        } else if ('uri' in picture && (picture as any).uri) {
            pictureUrl = (picture as any).uri;
        } else if ('url' in picture && (picture as any).url) { // Common in some other metadata standards
            pictureUrl = (picture as any).url;
        }
      }


      const coverPicture = lensProfile.metadata?.coverPicture;
      let coverPictureUrl = null;
      if (typeof coverPicture === 'object' && coverPicture !== null) {
         if ('optimized' in coverPicture && (coverPicture as any).optimized?.uri) {
            coverPictureUrl = (coverPicture as any).optimized.uri;
        } else if ('uri' in coverPicture && (coverPicture as any).uri) {
            coverPictureUrl = (coverPicture as any).uri;
        }
      }


      res.status(200).json({
        message: 'User profile fetched successfully.',
        profile: {
          address: lensProfile.ownedBy.address,
          handle: lensProfile.handle?.fullHandle || lensProfile.handle?.localName,
          profileId: lensProfile.id,
          bio: lensProfile.metadata?.bio,
          displayName: lensProfile.metadata?.displayName || lensProfile.handle?.localName,
          pictureUrl: pictureUrl,
          coverPictureUrl: coverPictureUrl,
          stats: lensProfile.stats,
          // Add other relevant public info
        },
      });
    } catch (error: any) {
      console.error(`Error fetching user profile for ${identifier}:`, error);
      res.status(500).json({ message: 'Error fetching user profile.', error: error.message });
    }
  }

  // TODO: Implement other user-related controllers:
  // - updateUserProfile
  // - getUserCreations (NFTs they've minted)
  // - getUserCollection (NFTs they own)
  // - getUserFollowing, getUserFollowers (from Lens)
}

// Ensure this line correctly exports an instance of UserController
export default new UserController();
