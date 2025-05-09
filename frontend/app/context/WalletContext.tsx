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
  useChainId,
  useChains as useWagmiChains,
} from 'wagmi';
import { fetchBalance } from '@wagmi/core';
import { config as wagmiConfig } from '../providers';
import { ConnectKitButton } from 'connectkit';
import { Chain } from 'wagmi/chains';

interface WalletBalance {
  value: bigint;
  formatted: string;
  symbol: string;
  decimals: number;
}

interface WalletContextType {
  address?: `0x${string}`;
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  isDisconnected: boolean;
  status: 'connected' | 'connecting' | 'reconnecting' | 'disconnected';
  openConnectModal?: () => void;
  disconnect: () => void;
  ensName?: string | null;
  chain?: Chain;
  chainId?: number;
  chains: readonly Chain[];
  switchChain?: (chainId: number) => Promise<void>;
  isSwitchingChain: boolean;
  nativeBalance?: WalletBalance;
  fetchTokenBalance: (tokenAddress: `0x${string}`) => Promise<WalletBalance | null>;
  isLoading: boolean;
  error?: Error | null;
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
  } = useAccount();

  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { data: ensNameData } = useEnsName({ address });
  const { switchChainAsync, isPending: isSwitchingChain } = useSwitchChain();
  const configuredChains = useWagmiChains();
  const currentChainId = useChainId();
  const [currentChain, setCurrentChain] = useState<Chain | undefined>(undefined);

  const openConnectModal = () => {
    console.error('ConnectKitButton.show() is not available. Use ConnectKitButton.Custom instead.');
  };

  const [nativeBalance, setNativeBalance] = useState<WalletBalance | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const newChain = configuredChains.find(c => c.id === currentChainId);
    setCurrentChain(newChain);
  }, [currentChainId, configuredChains]);

  const { data: wagmiNativeBalance, refetch: refetchNativeBalance } = useWagmiBalance({
    address,
    chainId: currentChainId,
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

  const fetchTokenBalance = useCallback(async (tokenAddress: `0x${string}`): Promise<WalletBalance | null> => {
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
  }, [address, currentChainId]);

  const handleSwitchChain = useCallback(async (newChainId: number) => {
    if (!switchChainAsync) {
      console.warn('switchChainAsync is not available');
      return;
    }
    setError(null);
    try {
      await switchChainAsync({ chainId: newChainId });
      await refetchNativeBalance();
    } catch (e) {
      console.error('Error switching chain:', e);
      setError(e instanceof Error ? e : new Error('Failed to switch chain'));
    }
  }, [switchChainAsync, refetchNativeBalance]);

  const handleDisconnect = useCallback(() => {
    wagmiDisconnect();
    setNativeBalance(undefined);
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
""
