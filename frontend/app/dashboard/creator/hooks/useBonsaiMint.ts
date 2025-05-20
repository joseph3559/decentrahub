// /home/scott/Desktop/Office/decentrahub/frontend/app/dashboard/creator/hooks/useBonsaiMint.ts
import { useState } from 'react';

// This MintData interface should align with what your ContentForm produces
// and what your backend /api/v1/content/mint endpoint expects.
export interface MintData {
  title: string;
  description: string;
  mediaIpfsUrl: string; // IPFS URL of the main media file
  mediaType: string;    // e.g., 'image/png', 'video/mp4'
  category: 'Article' | 'Music' | 'Video' | 'Art';
  tags: string[];
  price: number;
  creatorAddress: string; // Wallet address of the creator
  // smartMediaConfig?: any; // Optional: Configuration for Bonsai smart media features
}

// Structure of the expected successful response from the backend's /mint endpoint
interface BackendMintSuccessResponse {
  message: string;
  nftMetadataUrl: string;
  bonsaiTransaction: { // This structure comes from your backend's mock
    transactionHash: string;
    nftId: string;
    message: string;
  };
  lensPublicationId?: string; // Optional
}

// Structure for the error response from the backend
interface BackendErrorResponse {
    message: string;
    error?: string; // Optional detailed error message
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api/v1';

export const useBonsaiMint = () => {
  const [isMinting, setIsMinting] = useState(false);
  const [mintError, setMintError] = useState<string | null>(null);
  const [mintSuccessData, setMintSuccessData] = useState<BackendMintSuccessResponse | null>(null);

  const mintWithBonsai = async (data: MintData): Promise<{ success: boolean; transactionHash?: string; nftId?: string; error?: string }> => {
    setIsMinting(true);
    setMintError(null);
    setMintSuccessData(null);

    console.log('Attempting to mint via backend API with data:', data);

    try {
      const response = await fetch(`${API_BASE_URL}/content/mint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Add Authorization header if your backend requires authentication for this endpoint
          // e.g., 'Authorization': `Bearer ${yourAuthToken}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // If server returns an error (e.g., 400, 500), responseData might contain an error message
        const errorMsg = (responseData as BackendErrorResponse).message || `Error ${response.status}: Failed to mint content.`;
        console.error('Backend minting error:', responseData);
        throw new Error(errorMsg);
      }

      const successResponse = responseData as BackendMintSuccessResponse;
      setMintSuccessData(successResponse);
      console.log('Backend minting successful:', successResponse);
      return {
        success: true,
        transactionHash: successResponse.bonsaiTransaction.transactionHash,
        nftId: successResponse.bonsaiTransaction.nftId,
      };

    } catch (error: any) {
      console.error('Error calling mint API or processing response:', error);
      const errorMessage = error.message || 'An unknown error occurred during minting.';
      setMintError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsMinting(false);
    }
  };

  return {
    isMinting,
    mintError,
    mintSuccessData,
    mintWithBonsai,
  };
};
