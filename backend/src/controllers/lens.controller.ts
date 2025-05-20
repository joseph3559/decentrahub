import { Request, Response } from 'express';
import { createProfile, getProfile } from '../services/lens.service';

export const handleCreateProfile = async (req: Request, res: Response) => {
  try {
    const { handle } = req.body;
    const data = await createProfile(handle);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create profile', details: error });
  }
};

export const handleGetProfile = async (req: Request, res: Response) => {
  try {
    const { handle } = req.params;
    const data = await getProfile(handle);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile', details: error });
  }
};
