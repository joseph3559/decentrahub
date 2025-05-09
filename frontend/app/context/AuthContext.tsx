// /home/scott/Desktop/Office/decentrahub/frontend/src/app/context/AuthContext.tsx
'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useWallet } from './WalletContext'; // Assuming WalletContext.tsx is in the same directory

// Define the structure for Lens Profile data you want to store
interface LensProfile {
  id: string;
  handle?: string; // Lens handles can be optional or take time to propagate
  // Add other relevant profile details you might need
  // e.g., ownedBy: string; metadataUrl: string;
}

export type UserRole = 'creator' | 'consumer' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  lensProfile: LensProfile | null;
  isLoadingAuth: boolean; // To show loading state during auth check
  address: `0x${string}` | undefined; // Exposing connected address for convenience
  loginWithLens: () => Promise<void>; // Function to trigger login/profile fetch
  logoutLens: () => void; // Function to handle logout
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulated Lens Service function (replace with your actual service call)
// This would typically live in something like `src/app/services/lens.service.ts`
const fetchLensProfileByAddress = async (
  address: `0x${string}`
): Promise<LensProfile | null> => {
  console.log('AuthContext: Fetching Lens profile for address:', address);
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // --- SIMULATED LENS API RESPONSE ---
  // In a real scenario, you would query the Lens API
  // For example, using the Lens SDK or a direct GraphQL query
  // to get profiles owned by the address.
  // We'll simulate finding a profile for demonstration.
  // Replace this with your actual Lens profile fetching logic.

  // Example: If you want to test with a specific address having a profile
  if (address.toLowerCase() === '0xYourTestAddressWithProfile'.toLowerCase()) { // Replace with a test address
    return {
      id: '0x01', // Example profile ID
      handle: 'testuser.lens', // Example handle
    };
  }
  // Simulate no profile found for other addresses
  // return null;

  // For broad testing, let's assume any connected address has a basic profile
  // In a real app, many addresses won't have a Lens profile.
  return {
    id: `lens-profile-${address.slice(0, 6)}`, // Dummy ID
    handle: `${address.slice(0, 6)}.lens`,      // Dummy handle
  };
  // --- END SIMULATION ---
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { address: walletAddress, isConnected: isWalletConnected } = useWallet();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [lensProfile, setLensProfile] = useState<LensProfile | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true); // Start true to check on load

  const resetAuthState = useCallback(() => {
    setIsAuthenticated(false);
    setUserRole(null);
    setLensProfile(null);
    setIsLoadingAuth(false);
    console.log('AuthContext: Auth state reset.');
  }, []);

  const loginWithLens = useCallback(async () => {
    if (!walletAddress) {
      console.log('AuthContext: No wallet address, cannot login with Lens.');
      resetAuthState(); // Ensure clean state if address disappears
      return;
    }

    setIsLoadingAuth(true);
    console.log('AuthContext: Attempting login with Lens for address:', walletAddress);

    try {
      const profile = await fetchLensProfileByAddress(walletAddress);

      if (profile) {
        setLensProfile(profile);
        setIsAuthenticated(true);
        // TODO: Implement your role determination logic
        // For now, anyone with a Lens profile is a 'consumer'.
        // You might check profile metadata or other criteria for 'creator' role.
        setUserRole('consumer'); // Default role for authenticated user
        console.log('AuthContext: Lens Profile found and user authenticated.', profile);
      } else {
        console.log('AuthContext: No Lens Profile found for this address.');
        resetAuthState(); // No profile, so not authenticated in DecentraHub context
      }
    } catch (error) {
      console.error('AuthContext: Error fetching Lens profile:', error);
      resetAuthState();
    } finally {
      setIsLoadingAuth(false);
    }
  }, [walletAddress, resetAuthState]);

  const logoutLens = useCallback(() => {
    // The actual wallet disconnection is handled by ConnectKit/WalletContext.
    // This function ensures our app's auth state is reset.
    console.log('AuthContext: logoutLens called.');
    resetAuthState();
    // You might want to also explicitly call disconnect from useWallet() if it's not automatically
    // clearing address and isConnected state that AuthContext relies on.
    // Example: wallet.disconnect(); (if you pass disconnect from WalletContext)
  }, [resetAuthState]);

  // Effect to react to wallet connection changes
  useEffect(() => {
    if (isWalletConnected && walletAddress) {
      // Wallet has connected, try to log in with Lens
      loginWithLens();
    } else {
      // Wallet disconnected or no address
      resetAuthState();
    }
  }, [isWalletConnected, walletAddress, loginWithLens, resetAuthState]);


  // Initial check on component mount if wallet is already connected (e.g. from persisted session)
  // The above useEffect already handles this, but explicitly setting isLoadingAuth to false
  // if not connected on mount can be good.
   useEffect(() => {
    if (!isWalletConnected) {
      setIsLoadingAuth(false);
    }
  }, [isWalletConnected]);


  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        lensProfile,
        isLoadingAuth,
        address: walletAddress,
        loginWithLens,
        logoutLens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
