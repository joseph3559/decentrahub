import express from 'express';
import { handleCreateProfile, handleGetProfile } from '../controllers/lens.controller';

const router = express.Router();

router.post('/create', handleCreateProfile);
router.get('/profile/:handle', handleGetProfile);

export default router;
