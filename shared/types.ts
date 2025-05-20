// /home/scott/Desktop/Office/decentrahub/shared/types.ts

// User data structure from the backend
export interface BackendUser {
  userId: string; // Or number if using PostgreSQL auto-increment PK
  address: string;
  role: 'creator' | 'consumer';
  fullName?: string | null;
  bio?: string | null;
  email?: string | null; // Be mindful of privacy if displaying this
  avatarUrl?: string | null;
  website?: string | null;
  twitterHandle?: string | null;
  lensProfileId?: string | null;
  lensHandle?: string | null;
  isNewUser: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Lens profile data structure from the backend
export interface BackendLensProfile {
  id: string;
  handle?: string | null;
  ownedBy: string;
  stats?: any; // Define more specifically if needed (e.g., { totalFollowers: number, ... })
  // Add other relevant Lens profile fields you send from backend
}

// Response structure for the verify-wallet endpoint
export interface VerifyWalletResponse {
  message: string;
  user: BackendUser;
  lensProfile: BackendLensProfile | null;
}

// Payload structure for the verify-wallet endpoint
export interface VerifyWalletPayload {
  walletAddress: string;
  role: 'creator' | 'consumer';
  fullName?: string;
  bio?: string;
  email?: string;
  avatarUrl?: string;
  website?: string;
  twitterHandle?: string;
}

// Payload structure for updating user profile
export interface UpdateUserProfilePayload {
  fullName?: string | null;
  username?: string | null; // Usually username/handle is not updatable or handled differently
  bio?: string | null;
  email?: string | null; // Consider email verification flow if changed
  website?: string | null;
  twitterHandle?: string | null; // Backend might expect just the handle
  avatarUrl?: string | null;
  // Add any other updatable fields
}
