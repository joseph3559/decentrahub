// /home/scott/Desktop/Office/decentrahub/frontend/app/services/user.service.ts
import { type BackendUser, type UpdateUserProfilePayload } from '../../../shared/types'; // Adjusted path to shared types
// The ProfileFormValues type is specific to the form component and not directly used in this service's public API.
// If UpdateUserProfilePayload becomes very different from ProfileFormValues, you might do transformations in the component.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api/v1';

/**
 * Updates the user's profile information on the backend.
 * Assumes the backend identifies the user via an auth token (JWT) in the headers.
 * @param profileData The profile data to update, matching UpdateUserProfilePayload.
 * @returns The updated BackendUser object.
 */
export const updateUserProfile = async (
  profileData: UpdateUserProfilePayload // Using imported type from shared/types.ts
): Promise<BackendUser> => { // Using imported type from shared/types.ts
  try {
    // TODO: Get authentication token (e.g., JWT) if your backend requires it.
    // This token would typically be stored in AuthContext or secure storage.
    // const token = getAuthToken(); // Placeholder for getting token
    // if (!token) throw new Error('User not authenticated to update profile.');

    const response = await fetch(`${API_BASE_URL}/users/profile/me`, { // Endpoint for current authenticated user
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`, // Example: Include auth token
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}: Failed to update profile`);
    }

    console.log("Profile updated successfully via service:", data.user);
    return data.user as BackendUser; // Assuming backend returns { message: string, user: BackendUser }
  } catch (error) {
    console.error("Error in updateUserProfile service:", error);
    throw error; // Re-throw to be caught by the calling component (e.g., CreatorSettingsPage)
  }
};

/**
 * Fetches the current authenticated user's full profile from the backend.
 * This could be used if AuthContext's currentUser isn't always the most up-to-date
 * or if you need to fetch it on demand.
 * @returns The BackendUser object.
 */
export const getCurrentUserProfile = async (): Promise<BackendUser> => { // Using imported type
    try {
        // const token = getAuthToken();
        // if (!token) throw new Error('User not authenticated.');

        const response = await fetch(`${API_BASE_URL}/users/profile/me`, { // GET request
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch user profile');
        }
        return data.user as BackendUser; // Assuming backend returns { user: BackendUser }
    } catch (error) {
        console.error("Error fetching current user profile:", error);
        throw error;
    }
};
