import express from 'express';
import {
  fetchMatches,
  fetchLiveMatches,
  fetchPopular
} from '../services/provider.js';

const router = express.Router();

router.get('/matches/live', async (req, res) => {
  try {
    const sport = req.query.sport || null;
    const matches = await fetchLiveMatches(sport);
    res.json(matches);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

router.get('/matches/popular', async (req, res) => {
  try {
    const sport = req.query.sport || null;
    const matches = await fetchPopular(sport);
    res.json(matches);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

router.get('/matches/:sport', async (req, res) => {
  try {
    const matches = await fetchMatches(req.params.sport);
    res.json(matches);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

router.get('/matches', async (req, res) => {
  try {
    const matches = await fetchMatches();
    res.json(matches);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

export default router;