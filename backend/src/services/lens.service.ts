// src/services/lens.service.ts
import lensClient from '@/config/lensClient'; // Corrected path assuming tsconfig paths are set up
import { ProfileFragment, LimitType } from '@lens-protocol/client'; // Example import, added LimitType

/**
 * Service for interacting with the Lens Protocol.
 */
class LensService {
  /**
   * Fetches a Lens profile by handle.
   * @param handle The Lens handle (e.g., "username.lens").
   * @returns The Lens profile or null if not found.
   */
  async getProfileByHandle(handle: string): Promise<ProfileFragment | null> {
    try {
      console.log(`LensService: Fetching profile for handle: ${handle}`);
      const profile = await lensClient.profile.fetch({ forHandle: handle });
      if (!profile) {
        console.log(`LensService: No profile found for handle: ${handle}`);
        return null;
      }
      console.log(`LensService: Profile found for ${handle}:`, profile.id);
      return profile;
    } catch (error) {
      console.error(`LensService: Error fetching profile by handle ${handle}:`, error);
      return null;
    }
  }

  /**
   * Fetches the default Lens profile for a given wallet address.
   * @param address The wallet address.
   * @returns The default Lens profile for the address or null if no default profile is set or found.
   */
  async getProfileByAddress(address: string): Promise<ProfileFragment | null> {
     try {
      console.log(`LensService: Fetching default profile for address: ${address}`);
      const defaultProfile = await lensClient.profile.fetchDefault({
        for: address,
      });

      if (!defaultProfile) {
        console.log(`LensService: No default profile found for address: ${address}. Attempting to fetch any profile.`);
        const allOwnedProfiles = await lensClient.profile.fetchAll({ where: { ownedBy: [address] }});
        if (allOwnedProfiles.items.length > 0) {
            console.log(`LensService: Found ${allOwnedProfiles.items.length} profile(s) for ${address}. Returning the first one as no default is set.`);
            return allOwnedProfiles.items[0];
        }
        console.log(`LensService: No profiles at all found for address: ${address}`);
        return null;
      }

      console.log(`LensService: Default profile found for ${address}:`, defaultProfile.id);
      return defaultProfile;
    } catch (error) {
      console.error(`LensService: Error fetching default profile by address ${address}:`, error);
      return null;
    }
  }

  // TODO: Implement other Lens Protocol interactions:
  // - Creating posts (publications)
  // - Following profiles (direct follow action)
  // - Collecting publications
  // These will be crucial for meeting hackathon requirement #7.

  /**
   * Checks if an observer's wallet address follows a target profile ID.
   * @param observerWalletAddress The wallet address of the potential follower.
   * @param profileIdToFollow The profile ID of the profile to check against.
   * @returns True if the observerWalletAddress (via their default Lens profile) follows profileIdToFollow, false otherwise.
   */
  async checkFollow(observerWalletAddress: string, profileIdToFollow: string): Promise<boolean> {
    console.log(`LensService: Checking if ${observerWalletAddress} follows profile ${profileIdToFollow}`);
    try {
      // 1. Get the default profile of the observer.
      //    A user follows via one of their Lens profiles. We'll assume their default profile.
      const observerProfile = await this.getProfileByAddress(observerWalletAddress);
      if (!observerProfile) {
        console.log(`LensService: Observer profile not found for address ${observerWalletAddress}. Cannot check follow status.`);
        return false;
      }
      const observerProfileId = observerProfile.id;

      // 2. Fetch the list of profiles that the observerProfileId is following.
      //    For a robust check across many followed profiles, pagination would be needed here.
      //    For simplicity in a hackathon, checking the first page (e.g., 50 results) might be acceptable.
      const followingResult = await lensClient.profile.following({
        for: observerProfileId,
        limit: LimitType.Fifty, // Fetch up to 50 profiles.
      });

      // 3. Check if profileIdToFollow is in the list of followed profiles.
      //    Explicitly type `followedProfile` in the .some() callback.
      const isFollowing = followingResult.items.some((followedProfile: ProfileFragment) => followedProfile.id === profileIdToFollow);

      // For more exhaustive checking with pagination (if needed and time permits):
      // let cursor = followingResult.pageInfo.next;
      // while (!isFollowing && cursor) {
      //   const nextPageResult = await lensClient.profile.following({
      //     for: observerProfileId,
      //     limit: LimitType.Fifty,
      //     cursor: cursor,
      //   });
      //   if (nextPageResult.items.some((followedProfile: ProfileFragment) => followedProfile.id === profileIdToFollow)) {
      //     isFollowing = true;
      //   }
      //   cursor = nextPageResult.pageInfo.next;
      // }

      console.log(`LensService: Profile ${observerProfileId} (${observerWalletAddress}) ${isFollowing ? 'is' : 'is not'} following profile ${profileIdToFollow}.`);
      return isFollowing;

    } catch (error) {
        console.error(`LensService: Error checking follow status for ${observerWalletAddress} on ${profileIdToFollow}:`, error);
        return false; // Return false in case of an error
    }
  }
}

export default new LensService();
