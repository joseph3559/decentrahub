// src/routes/auth.routes.ts
import { Router } from 'express';
import authController from '@/controllers/auth.controller'; // Corrected path
import asyncHandler from '@/utils/asyncHandler'; // Corrected path

const router = Router();

// Route to get user profile info (e.g., Lens profile) after wallet connection
// The actual wallet connection happens on the frontend with ConnectKit.
// This backend route can verify the address or fetch associated data.
router.post('/verify-wallet', asyncHandler(authController.verifyWalletAndGetProfile));

// Example: Route to check if a user is a "creator" based on some criteria
// router.get('/check-creator-status/:walletAddress', asyncHandler(authController.checkCreatorStatus));

export default router;
