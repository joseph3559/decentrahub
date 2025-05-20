// src/controllers/content.controller.ts
import { Request, Response } from 'express';
import ipfsService from '@/services/ipfs.service'; // Corrected path
import bonsaiService from '@/services/bonsai.service'; // Corrected path
// import lensService from '@/services/lens.service'; // If Lens publication is part of minting flow

// Define the expected structure of the mint request body from the frontend
interface MintRequestBody {
  title: string;
  description: string;
  mediaIpfsUrl: string; // IPFS URL of the main media file (already uploaded by frontend or via this backend)
  mediaType: string; // e.g., 'image/png', 'video/mp4'
  category: 'Article' | 'Music' | 'Video' | 'Art';
  tags: string[];
  price: number;
  creatorAddress: string; // Wallet address of the creator (from authenticated user)
  // smartMediaConfig: any; // Configuration for Bonsai smart media features
  // coverImageUrl?: string; // Optional: IPFS URL for a cover image if different from main media
}

class ContentController {
  /**
   * Handles the minting of new content.
   * This controller will orchestrate:
   * 1. Preparing metadata for the NFT.
   * 2. Pinning metadata to IPFS (if not handled by Bonsai directly).
   * 3. Calling BonsaiService to mint the Smart Media NFT on Lens Chain.
   * 4. Optionally, creating a Lens publication for the new NFT.
   */
  async mintContent(req: Request, res: Response): Promise<void> {
    const {
      title,
      description,
      mediaIpfsUrl, // This should be the CID from frontend upload or a previous step
      mediaType,
      category,
      tags,
      price,
      creatorAddress, // Should come from authenticated user session or verified request
      // smartMediaConfig,
      // coverImageUrl,
    } = req.body as MintRequestBody;

    // Basic validation
    if (!title || !description || !mediaIpfsUrl || !category || !creatorAddress) {
      res.status(400).json({ message: 'Missing required fields for minting.' });
      return;
    }

    try {
      console.log('ContentController: Received mint request for:', title);

      // 1. Construct the NFT Metadata (following Lens Metadata Standards or Bonsai's requirements)
      // This metadata will itself be pinned to IPFS.
      // Refer to Lens documentation for metadata structure: https://docs.lens.xyz/docs/metadata-standards
      const nftMetadata = {
        version: '2.0.0', // Or appropriate Lens metadata version
        metadata_id: `decentrahub-nft-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        description: description,
        name: title,
        external_url: `https://yourfrontend.com/nft/placeholder_id`, // Link to view on your platform
        image: category === 'Art' || category === 'Video' ? mediaIpfsUrl : undefined, // Or a specific cover image
        animation_url: category === 'Video' || category === 'Music' ? mediaIpfsUrl : undefined,
        attributes: [
          { trait_type: 'Category', value: category },
          { trait_type: 'Price', value: price.toString() },
          ...tags.map(tag => ({ trait_type: 'Tag', value: tag })),
          // Add any Bonsai-specific attributes or attributes for smart features
        ],
        // Media object(s)
        media: [
          {
            item: mediaIpfsUrl,
            type: mediaType,
            // altTag: `Cover for ${title}`, // Optional
            // cover: coverImageUrl || (category === 'Art' ? mediaIpfsUrl : undefined) // Optional
          }
        ],
        appId: 'DecentraHubHackathonApp', // Your unique App ID for Lens
        // Potentially add locale, mainContentFocus, etc.
        // Bonsai might require specific fields within this metadata or a separate config.
      };

      // 2. Pin NFT Metadata to IPFS
      // Bonsai might handle metadata pinning itself, or you might do it here.
      // For this example, let's assume we pin it and pass the metadata CID to Bonsai.
      const metadataIpfsUrl = await ipfsService.pinJsonToIpfs(nftMetadata);
      if (!metadataIpfsUrl) {
        res.status(500).json({ message: 'Failed to pin NFT metadata to IPFS.' });
        return;
      }
      console.log('ContentController: NFT Metadata pinned to IPFS:', metadataIpfsUrl);

      // 3. Call BonsaiService to mint the Smart Media NFT
      // The `smartMediaConfig` would be passed here if you have specific Bonsai features configured.
      // For now, passing a placeholder or letting Bonsai use defaults based on metadata.
      const bonsaiResult = await bonsaiService.mintSmartMedia(
        creatorAddress,
        metadataIpfsUrl, // Pass the IPFS URL of the *metadata JSON*
        { /* smartMediaConfig placeholder */ }
      );

      if (!bonsaiResult || !bonsaiResult.transactionHash) {
        res.status(500).json({ message: 'Bonsai Smart Media minting failed.' });
        return;
      }
      console.log('ContentController: Bonsai minting successful:', bonsaiResult);

      // 4. Optionally, create a Lens Publication (e.g., a Post) for this new NFT
      // This is crucial for Lens social primitive integration (Hackathon Req #7)
      // Example:
      // await lensService.createPost({
      //   profileId: "creator's Lens Profile ID", // Fetch this based on creatorAddress
      //   contentURI: metadataIpfsUrl, // The NFT metadata itself can be the content of the post
      //   collectModule: { freeCollectModule: { followerOnly: false } }, // Example collect module
      //   referenceModule: { followerOnlyReferenceModule: false }, // Example reference module
      // });
      // console.log('ContentController: Lens publication created for the new NFT.');


      res.status(201).json({
        message: `Content "${title}" minted successfully as a Smart Media NFT!`,
        nftMetadataUrl: metadataIpfsUrl,
        bonsaiTransaction: bonsaiResult,
        // lensPublicationId: "ID_OF_LENS_POST" // If created
      });
    } catch (error: any) {
      console.error('Error in mintContent controller:', error);
      res.status(500).json({ message: 'Error minting content.', error: error.message });
    }
  }

  // TODO: Implement other content-related controllers
  // async getMarketplaceItems(req: Request, res: Response): Promise<void> { /* ... */ }
  // async getNftDetails(req: Request, res: Response): Promise<void> { /* ... */ }
}

export default new ContentController();
