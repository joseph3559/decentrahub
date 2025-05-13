// /home/scott/Desktop/Office/decentrahub/frontend/app/providers.tsx
'use client';

import { WagmiProvider, createConfig } from 'wagmi';
import { mainnet, polygon, sepolia } from 'wagmi/chains'; // Add your specific chains
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes'; // If you're using next-themes
import { http } from 'viem'

// Import your custom context providers
import { WalletProvider as DecentraHubWalletProvider } from './context/WalletContext';
import { AuthProvider as DecentraHubAuthProvider } from './context/AuthContext'; // Make sure this path is correct

// Define your chains (add Lens Chain here once its config is available)
// Example: Using Polygon Mumbai as a proxy for Lens Devnet if needed
const LENS_CHAIN_ID = 80001; // Replace with actual Lens Chain ID
const lensChain = { // THIS IS AN EXAMPLE - REPLACE WITH ACTUAL LENS CHAIN CONFIG
  id: LENS_CHAIN_ID,
  name: 'Lens Testnet', // Or 'Lens Mainnet'
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc-mumbai.maticvigil.com'] }, // Replace with actual Lens RPC
  },
  blockExplorers: {
    default: { name: 'PolygonScan', url: 'https://mumbai.polygonscan.com' }, // Replace
  },
  // Ensure any other required properties for a Chain object are included
  testnet: true, // Example property, check Wagmi/Viem Chain definition
};

// Ensure environment variables are correctly loaded
const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID;
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

// TEMPORARY BYPASS FOR WalletConnect Project ID
const effectiveWalletConnectProjectId = walletConnectProjectId || "TEMP_PROJECT_ID_DO_NOT_USE_IN_PROD";

if (!alchemyId) {
  console.warn("NEXT_PUBLIC_ALCHEMY_ID is not set. Some features might not work.");
}

if (!walletConnectProjectId) {
  // Comment out the error for temporary bypass
  // throw new Error("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. WalletConnect will not work.");
  console.warn(
    "**********************************************************************************\n" +
    "WARNING: NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is NOT SET.\n" +
    "WalletConnect functionality will be disabled or severely limited.\n" +
    "Please obtain a Project ID from https://cloud.walletconnect.com/ and set it in your .env.local file.\n" +
    "**********************************************************************************"
  );
}

export const config = createConfig(
  getDefaultConfig({
    walletConnectProjectId: effectiveWalletConnectProjectId,
    appName: 'DecentraHub',
    appDescription: 'Decentralized Content Marketplace for Creators',
    chains: [mainnet, polygon, sepolia, lensChain],
    transports: {
      [mainnet.id]: http(`https://eth-mainnet.alchemyapi.io/v2/${alchemyId}`),
      [polygon.id]: http(`https://polygon-mainnet.g.alchemy.com/v2/${alchemyId}`),
      // Add other chains as needed
    },
  }),
);

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem> {/* Or your preferred theme setup */}
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ConnectKitProvider theme="auto" mode="auto"> {/* Or your preferred ConnectKit theme */}
            <DecentraHubWalletProvider>
              {/* AuthProvider MUST be inside WalletProvider because AuthContext uses useWallet() */}
              <DecentraHubAuthProvider>
                {children}
              </DecentraHubAuthProvider>
            </DecentraHubWalletProvider>
          </ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
