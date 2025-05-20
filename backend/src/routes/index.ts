// src/routes/index.ts
import { Router } from 'express';
import authRoutes from './auth.routes';
import contentRoutes from './content.routes';
import userRoutes from './user.routes';
// import lensRoutes from './lens.routes'; // Optional: if you want specific Lens proxy routes

const router = Router();

router.use('/auth', authRoutes);
router.use('/content', contentRoutes);
router.use('/users', userRoutes);
// router.use('/lens', lensRoutes);

export default router;
