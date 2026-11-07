
import express from 'express';
import { fetchMatches } from '../services/provider.js';
import { fetchStreamsForMatch } from '../services/streamed.js';

const router = express.Router();

router.get('/:id/stream', async (req, res) => {
  try {
    const { id } = req.params;
    const matches = await fetchMatches();

    const match = matches.find(
      (item) => String(item.id) === String(id)
    );

    if (!match) {
      return res.status(404).json({
        error: 'Match not found'
      });
    }

    const streams = await fetchStreamsForMatch(id);

    return res.json({
      matchId: id,
      streams
    });
  } catch (error) {
    console.error('Stream route error:', error.message);

    return res.status(500).json({
      error: 'Unable to retrieve streams'
    });
  }
});

export default router;
