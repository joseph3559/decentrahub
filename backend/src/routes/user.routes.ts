// src/routes/user.routes.ts
import { Router } from 'express';
import userController from '@/controllers/user.controller'; // This should import the instance of UserController
import asyncHandler from '@/utils/asyncHandler';
// import { protectRoute } from '@/middlewares/auth.middleware';

const router = Router(); // This 'router' is an Express Router instance

// Get public user profile (can include Lens handle, basic info)
// Here, 'userController' must be the instance of your UserController class
router.get('/:identifier', asyncHandler(userController.getUserProfile));

// Example: Get user's created NFTs (protected or public with limitations)
// router.get('/:userId/creations', /* protectRoute, */ asyncHandler(userController.getUserCreations));

// Example: Get user's collected NFTs (protected or public with limitations)
// router.get('/:userId/collection', /* protectRoute, */ asyncHandler(userController.getUserCollection));

// Example: Update user profile settings (protected)
// router.put('/profile', /* protectRoute, */ asyncHandler(userController.updateUserProfile));

export default router;
