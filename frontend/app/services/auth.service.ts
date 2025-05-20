// /home/scott/Desktop/Office/decentrahub/frontend/app/services/auth.service.ts
import {
  type VerifyWalletResponse,
  type VerifyWalletPayload,
} from '../../../shared/types'; // Ensure this path to shared/types.ts is correct

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api/v1';

export const verifyWalletWithBackend = async (
  payload: VerifyWalletPayload
): Promise<VerifyWalletResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-wallet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}: Failed to verify wallet with backend`);
    }

    return data as VerifyWalletResponse;
  } catch (error) {
    console.error("Error calling verifyWalletWithBackend:", error);
    throw error;
  }
};
