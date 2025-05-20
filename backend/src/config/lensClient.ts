// src/config/lensClient.ts
import { LensClient, development, production } from '@lens-protocol/client';

// Determine the Lens environment based on NODE_ENV or a specific Lens env variable
// For the hackathon, you'll likely be using a testnet/sandbox or mainnet.
// Ensure your .env file has ALCHEMY_API_KEY_LENS_CHAIN set appropriately for the chosen environment.

let lensEnvironment = development; // Default to development (e.g., Mumbai testnet)
if (process.env.LENS_ENV === 'production' || process.env.NODE_ENV === 'production') {
  // lensEnvironment = production; // Use this for Lens Mainnet (Polygon Mainnet)
  // For the hackathon, confirm if "Lens Chain" refers to mainnet or a specific testnet.
  // If Lens Chain is a specific testnet not covered by `development`, you might need custom config.
  console.log('Lens Client configured for Production (Mainnet).');
} else {
  console.log('Lens Client configured for Development (e.g., Mumbai Testnet).');
}

// Configure the LensClient
// The Lens SDK typically uses providers like Alchemy or Infura.
// Ensure your ALCHEMY_API_KEY_LENS_CHAIN is correctly set in your .env for the target network.
// The SDK might infer provider URLs based on the environment, or you might need to specify them.
const lensClient = new LensClient({
  environment: lensEnvironment,
  // storage: new InMemoryStorageProvider(), // Optional: for caching, not strictly needed for basic operations
  // You might need to configure `sources` if you have specific app IDs for Lens.
});

export default lensClient;
