// /home/scott/Desktop/Office/decentrahub/frontend/app/context/AuthContext.tsx
'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useWallet as useWagmiWalletHook } from './WalletContext'; // Your existing WalletContext hook
import { RoleSelectionModal } from '../components/auth/RoleSelectionModal'; // Import the modal
import { toast } from "sonner";
// Correctly import types from your shared types file
import {
    type BackendUser,
    type BackendLensProfile,
    type VerifyWalletResponse,
    type VerifyWalletPayload // Added this import as it's used in the payload
} from '../../../shared/types'; // Adjusted path to the shared types file

// Import the service function
import { verifyWalletWithBackend } from '../services/auth.service';


// UserRoleType from your backend User.model.ts (or shared types)
export type UserRole = 'creator' | 'consumer' | null;

// AuthenticatedUser now correctly extends BackendUser without overriding properties
// The properties like userId, avatarUrl, etc., will be inherited from BackendUser
export interface AuthenticatedUser extends BackendUser {}

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: AuthenticatedUser | null;
  userRole: UserRole; // Still useful for quick checks
  lensProfileData: BackendLensProfile | null;
  isLoadingAuth: boolean;
  address: `0x${string}` | undefined;
  logout: () => void;
  triggerAuthFlow: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { address: walletAddress, isConnected: isWalletConnected, disconnect: wagmiDisconnect } = useWagmiWalletHook();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [lensProfileData, setLensProfileData] = useState<BackendLensProfile | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [showRoleModal, setShowRoleModal] = useState<boolean>(false);

  const resetAuthState = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUserRole(null);
    setLensProfileData(null);
    setIsLoadingAuth(false);
    setShowRoleModal(false);
    console.log('AuthContext: Auth state reset.');
    // localStorage.removeItem('decentrahub_user_session');
  }, []);

  const processBackendAuthResponse = (data: VerifyWalletResponse) => {
    // data.user is of type BackendUser, which is compatible with AuthenticatedUser
    setCurrentUser(data.user);
    setUserRole(data.user.role);
    setLensProfileData(data.lensProfile);
    setIsAuthenticated(true);
    // localStorage.setItem('decentrahub_user_session', JSON.stringify({ user: data.user, lensProfile: data.lensProfile }));
    toast.success(data.message || "Successfully authenticated!", {
        description: `Welcome, ${data.user.fullName || data.user.address} (${data.user.role})`
    });
  };

  const handleRoleSubmittedAndVerify = async (
    selectedRole: 'creator' | 'consumer',
    additionalInfo: { fullName?: string; email?: string }
  ) => {
    setShowRoleModal(false);
    if (!walletAddress) {
      toast.error("Wallet address not found after role submission.");
      resetAuthState();
      return;
    }
    setIsLoadingAuth(true);
    try {
      // Construct the payload according to VerifyWalletPayload
      const payload: VerifyWalletPayload = {
        walletAddress,
        role: selectedRole,
        fullName: additionalInfo.fullName,
        email: additionalInfo.email,
        // avatarUrl, website, twitterHandle could be added here if collected in modal
      };
      const backendResponse = await verifyWalletWithBackend(payload);
      processBackendAuthResponse(backendResponse);
    } catch (error: any) {
      console.error('AuthContext: Error verifying wallet with backend:', error);
      toast.error("Authentication Failed", { description: error.message || "Could not connect to the server." });
      resetAuthState();
    } finally {
      setIsLoadingAuth(false);
    }
  };

  useEffect(() => {
    if (isWalletConnected && walletAddress && !isAuthenticated && !isLoadingAuth && !currentUser) {
      console.log('AuthContext: Wallet connected, user not authenticated in this session. Showing role modal.');
      setShowRoleModal(true);
    } else if (!isWalletConnected && isAuthenticated) {
      console.log('AuthContext: Wallet disconnected, resetting auth state for this session.');
      resetAuthState();
    }

    if (!isWalletConnected && !isAuthenticated) {
        setIsLoadingAuth(false);
    }
  }, [isWalletConnected, walletAddress, isAuthenticated, isLoadingAuth, currentUser, resetAuthState]);

  const logout = useCallback(() => {
    wagmiDisconnect();
    resetAuthState();
    toast.info("You have been logged out.");
  }, [wagmiDisconnect, resetAuthState]);

  const triggerAuthFlow = () => {
    if (!isWalletConnected) {
        toast.info("Please connect your wallet first using the ConnectKit button.");
        return;
    }
    if (isWalletConnected && walletAddress && !isAuthenticated && !currentUser) {
        console.log('AuthContext: Triggering role modal manually.');
        setShowRoleModal(true);
    } else if (isAuthenticated) {
        toast.success("You are already authenticated!");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        userRole,
        lensProfileData,
        isLoadingAuth,
        address: walletAddress,
        logout,
        triggerAuthFlow,
      }}
    >
      {children}
      <RoleSelectionModal
        isOpen={showRoleModal && !!walletAddress && !isAuthenticated && !currentUser}
        onClose={() => {
            setShowRoleModal(false);
            if (!isAuthenticated) {
                toast.info("Role selection process was closed.");
            }
        }}
        onRoleSubmit={handleRoleSubmittedAndVerify}
        walletAddress={walletAddress}
      />
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
