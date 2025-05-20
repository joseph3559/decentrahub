// src/routes/user.routes.ts
import { Router } from 'express';
import userController from '@/controllers/user.controller';
import asyncHandler from '@/utils/asyncHandler';
// import { protectRoute } from '@/middlewares/auth.middleware'; // You'll need an auth middleware

const router = Router();

// Get public user profile by identifier (address or handle)
router.get('/:identifier', asyncHandler(userController.getUserProfile));

// Get current authenticated user's profile (assumes auth middleware sets req.user)
router.get('/profile/me', /* protectRoute, */ asyncHandler(userController.getCurrentAuthenticatedUserProfile));

// Update current authenticated user's profile (assumes auth middleware sets req.user)
router.put('/profile/me', /* protectRoute, */ asyncHandler(userController.updateCurrentAuthenticatedUserProfile));


// Example: Get user's created NFTs (protected or public with limitations)
// router.get('/:userId/creations', /* protectRoute, */ asyncHandler(userController.getUserCreations));

// Example: Get user's collected NFTs (protected or public with limitations)
// router.get('/:userId/collection', /* protectRoute, */ asyncHandler(userController.getUserCollection));

export default router;
