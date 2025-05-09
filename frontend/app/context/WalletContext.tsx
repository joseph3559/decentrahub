// /home/scott/Desktop/Office/decentrahub/frontend/src/app/context/WalletContext.tsx
'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useState,
  useEffect,
} from 'react';
import {
  useAccount,
  useDisconnect,
  useEnsName,
  useBalance as useWagmiBalance,
  useSwitchChain,
  Chain,
  useChainId,
  useChains as useWagmiChains,
} from 'wagmi';
import { fetchBalance } from '@wagmi/core'; // For on-demand balance fetching
import { config as wagmiConfig } from '../providers'; // Assuming your Wagmi config is exported from providers.tsx
import { useConnectKit } from 'connectkit'; // To programmatically open ConnectKit modal if needed

interface WalletBalance {
  value: bigint;
  formatted: string;
  symbol: string;
  decimals: number;
}

interface WalletContextType {
  // Connection State
  address?: `0x${string}`;
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  isDisconnected: boolean;
  status: 'connected' | 'connecting' | 'reconnecting' | 'disconnected';

  // Wallet Actions
  openConnectModal?: () => void; // To programmatically open ConnectKit
  disconnect: () => void;
  ensName?: string | null;

  // Chain State & Actions
  chain?: Chain; // Current connected chain object
  chainId?: number; // Current connected chain ID
  chains: readonly Chain[]; // Available chains configured in Wagmi
  switchChain?: (chainId: number) => Promise<void>;
  isSwitchingChain: boolean;

  // Balance
  nativeBalance?: WalletBalance; // Balance of the native currency of the connected chain
  fetchTokenBalance: (
    tokenAddress: `0x${string}`
  ) => Promise<WalletBalance | null>;

  // General Context State
  isLoading: boolean; // For actions initiated by the context itself
  error?: Error | null; // For errors from context actions
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const {
    address,
    isConnected,
    isConnecting,
    isReconnecting,
    isDisconnected,
    status,
    chainId: currentChainIdFromAccount, // chainId from useAccount might be more up-to-date during switching
  } = useAccount();

  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { data: ensNameData } = useEnsName({ address });
  const { switchChainAsync, isPending: isSwitchingChain } = useSwitchChain();

  const configuredChains = useWagmiChains(); // Get all chains configured in Wagmi
  const currentChainId = useChainId(); // More reliable current chain ID
  const [currentChain, setCurrentChain] = useState<Chain | undefined>(undefined)


  const { openConnectModal } = useConnectKit(); // Get the function to open modal

  const [nativeBalance, setNativeBalance] = useState<WalletBalance | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Update currentChain based on currentChainId and configuredChains
  useEffect(() => {
    const newChain = configuredChains.find(c => c.id === currentChainId);
    setCurrentChain(newChain);
  }, [currentChainId, configuredChains]);


  // Fetch native balance when address or chainId changes
  const { data: wagmiNativeBalance, refetch: refetchNativeBalance } = useWagmiBalance({
    address,
    chainId: currentChainId, // Ensure balance is fetched for the correct chain
  });

  useEffect(() => {
    if (wagmiNativeBalance) {
      setNativeBalance({
        value: wagmiNativeBalance.value,
        formatted: wagmiNativeBalance.formatted,
        symbol: wagmiNativeBalance.symbol,
        decimals: wagmiNativeBalance.decimals,
      });
    } else {
      setNativeBalance(undefined);
    }
  }, [wagmiNativeBalance]);

  // Function to fetch ERC20 token balance on demand
  const fetchTokenBalance = useCallback(
    async (tokenAddress: `0x${string}`): Promise<WalletBalance | null> => {
      if (!address || !currentChainId) {
        setError(new Error('Wallet not connected or chain ID unavailable.'));
        return null;
      }
      setIsLoading(true);
      setError(null);
      try {
        const balanceResult = await fetchBalance(wagmiConfig, {
          address,
          token: tokenAddress,
          chainId: currentChainId,
        });
        setIsLoading(false);
        return {
          value: balanceResult.value,
          formatted: balanceResult.formatted,
          symbol: balanceResult.symbol,
          decimals: balanceResult.decimals,
        };
      } catch (e) {
        console.error('Error fetching token balance:', e);
        setError(e instanceof Error ? e : new Error('Failed to fetch token balance'));
        setIsLoading(false);
        return null;
      }
    },
    [address, currentChainId]
  );

  // Wrapper for switching chain
  const handleSwitchChain = useCallback(
    async (newChainId: number) => {
      if (!switchChainAsync) {
        console.warn('switchChainAsync is not available');
        return;
      }
      setError(null);
      try {
        await switchChainAsync({ chainId: newChainId });
        // Balance and other chain-specific data will update via their hooks
        await refetchNativeBalance();
      } catch (e) {
        console.error('Error switching chain:', e);
        setError(e instanceof Error ? e : new Error('Failed to switch chain'));
      }
    },
    [switchChainAsync, refetchNativeBalance]
  );

  const handleDisconnect = useCallback(() => {
    wagmiDisconnect();
    setNativeBalance(undefined); // Clear balance on disconnect
    // Other context-specific state resets can go here
  }, [wagmiDisconnect]);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        isConnecting,
        isReconnecting,
        isDisconnected,
        status,
        openConnectModal,
        disconnect: handleDisconnect,
        ensName: ensNameData,
        chain: currentChain,
        chainId: currentChainId,
        chains: configuredChains,
        switchChain: handleSwitchChain,
        isSwitchingChain,
        nativeBalance,
        fetchTokenBalance,
        isLoading,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
