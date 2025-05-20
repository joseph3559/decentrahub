// src/routes/content.routes.ts
import { Router } from 'express';
import contentController from '@/controllers/content.controller'; // Corrected path
import asyncHandler from '@/utils/asyncHandler'; // Corrected path
// import { protectRoute, creatorOnly } from '@/middlewares/auth.middleware'; // Example for protected routes

const router = Router();

// Route for minting new content
// This route would be called by the frontend after preparing all metadata and media.
// For a hackathon, you might simplify this to take essential data and the backend orchestrates IPFS + Bonsai.
router.post('/mint', /* protectRoute, creatorOnly, */ asyncHandler(contentController.mintContent));


// TODO: Add routes for:
// - Fetching marketplace content (publicly accessible)
// - Fetching specific NFT details
// - Fetching user's created NFTs
// - Fetching user's collected NFTs

// Example: Get all listed content (public)
// router.get('/', asyncHandler(contentController.getMarketplaceItems));

// Example: Get details for a specific NFT
// router.get('/:nftId', asyncHandler(contentController.getNftDetails));


export default router;
