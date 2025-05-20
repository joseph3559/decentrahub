// src/services/ipfs.service.ts
import axios from 'axios'; // For making HTTP requests to Pinata or other IPFS services

/**
 * Service for interacting with IPFS, primarily for pinning metadata or content
 * if not handled directly by Bonsai or another part of your stack.
 */
class IpfsService {
  private pinataApiKey: string | undefined;
  private pinataSecretApiKey: string | undefined;
  private pinataBaseUrl = 'https://api.pinata.cloud';

  constructor() {
    this.pinataApiKey = process.env.PINATA_API_KEY;
    this.pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;

    if (this.pinataApiKey && this.pinataSecretApiKey) {
      console.log('IpfsService (Pinata) initialized with API keys.');
    } else {
      console.warn('IpfsService (Pinata) initialized WITHOUT API keys. Pinning will fail.');
    }
  }

  /**
   * Pins JSON metadata to IPFS using Pinata.
   * @param metadata The JSON object to pin.
   * @returns The IPFS hash (CID) of the pinned JSON.
   */
  async pinJsonToIpfs(metadata: Record<string, any>): Promise<string | null> {
    if (!this.pinataApiKey || !this.pinataSecretApiKey) {
      console.error('Pinata API Key or Secret is missing. Cannot pin JSON to IPFS.');
      // For hackathon, maybe return a mock IPFS hash if keys are missing to allow frontend to proceed
      // return `ipfs://QmSimulatedMetadataHash${Date.now()}`;
      throw new Error('Pinata API Key or Secret is missing.');
    }

    try {
      console.log('IpfsService: Pinning JSON to IPFS via Pinata:', metadata);
      const response = await axios.post(
        `${this.pinataBaseUrl}/pinning/pinJSONToIPFS`,
        metadata,
        {
          headers: {
            'Content-Type': 'application/json',
            'pinata_api_key': this.pinataApiKey,
            'pinata_secret_api_key': this.pinataSecretApiKey,
          },
        }
      );
      const ipfsHash = response.data.IpfsHash;
      console.log('IpfsService: JSON pinned successfully. CID:', ipfsHash);
      return `ipfs://${ipfsHash}`;
    } catch (error: any) {
      console.error('IpfsService: Error pinning JSON to IPFS:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Pins a file to IPFS using Pinata.
   * This is more complex as it involves handling file streams (FormData).
   * For the hackathon, you might upload files on the frontend directly to an IPFS service
   * or use a simpler approach if Bonsai handles media pinning.
   * This is a placeholder for now.
   * @param file File data (e.g., Buffer or Stream)
   * @param fileName Original file name
   * @returns The IPFS hash (CID) of the pinned file.
   */
  async pinFileToIpfs(file: any, fileName: string): Promise<string | null> {
    console.warn('IpfsService: pinFileToIpfs is a placeholder and not fully implemented for direct backend file upload.');
    if (!this.pinataApiKey || !this.pinataSecretApiKey) {
        console.error('Pinata API Key or Secret is missing. Cannot pin File to IPFS.');
        throw new Error('Pinata API Key or Secret is missing.');
    }
    // Actual implementation would use FormData and stream the file.
    // Example:
    // const formData = new FormData();
    // formData.append('file', file, fileName);
    // const response = await axios.post(`${this.pinataBaseUrl}/pinning/pinFileToIPFS`, formData, { ... });
    return `ipfs://QmSimulatedFileHash${Date.now()}/${fileName}`; // Placeholder
  }
}

export default new IpfsService();
