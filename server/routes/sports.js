import express from 'express';
import { fetchSports } from '../services/provider.js';

const router = express.Router();

router.get('/sports', async (req, res) => {
  try {
    const sports = await fetchSports();
    res.json(sports);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

export default router;