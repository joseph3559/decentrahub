// /home/scott/Desktop/Office/decentrahub/frontend/src/app/providers.tsx
'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, polygon, sepolia } from 'wagmi/chains'; // Add Lens Chain when available
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // ConnectKit uses React Query

import { WalletProvider as DecentraHubWalletProvider } from './context/WalletContext'; // Our context

// Define your chains (add Lens Chain here once its config is available)
// For now, let's use Sepolia as a stand-in if Lens Chain isn't directly supported by wagmi/chains yet
// You might need to define Lens Chain as a custom chain object.
const LENS_CHAIN_ID = 80001; // Example: Polygon Mumbai as a proxy for Lens Devnet
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
};


export const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID, // Get from Alchemy Dashboard
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!, // Get from WalletConnect Cloud

    // Required
    appName: 'DecentraHub',

    // Optional
    appDescription: 'Decentralized Content Marketplace for Creators',
    appUrl: 'https://family.co', // your app's url
    appIcon: 'https://family.co/logo.png', // your app's icon, no bigger than 1024x1024px (max. 1MB)
    chains: [mainnet, polygon, sepolia, lensChain], // Add Lens Chain here
  }),
);

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider theme="auto" mode="auto"> {/* Options: "light", "dark", "auto"; "siwe" (optional) */}
          <DecentraHubWalletProvider>{children}</DecentraHubWalletProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
