import express from 'express';
import { fetchMatches } from '../services/provider.js';
import { fetchStreamsFromSource } from '../services/streamed.js';

const router = express.Router();

router.get('/matches/:id/stream', async (req, res) => {
  try {
    const matches = await fetchMatches();

    const match = matches.find(
      (item) =>
        String(item.id) ===
        String(req.params.id)
    );

    if (!match) {
      return res.status(404).json({
        error: 'This event is no longer available.'
      });
    }

    if (!Array.isArray(match.sources) || !match.sources.length) {
      return res.status(404).json({
        error: 'No stream source is available for this event.'
      });
    }

    const streams = [];

    for (const source of match.sources) {
      if (!source?.source || !source?.id) {
        continue;
      }

      try {
        const result =
          await fetchStreamsFromSource(
            source.source,
            source.id
          );

        if (Array.isArray(result)) {
          streams.push(...result);
        } else if (result) {
          streams.push(result);
        }
      } catch (err) {
        console.error(
          `Stream source error (${source.source}/${source.id}):`,
          err.message
        );
      }
    }

    const playable = streams.filter(
      (stream) =>
        stream &&
        typeof stream.embedUrl === 'string' &&
        stream.embedUrl.trim()
    );

    if (!playable.length) {
      return res.status(404).json({
        error:
          'No playable stream is currently available for this event.'
      });
    }

    res.json({
      matchId: match.id,
      streams: playable
    });
  } catch (err) {
    console.error(
      'Stream route error:',
      err.message
    );

    res.status(500).json({
      error:
        'Unable to load the stream right now.'
    });
  }
});

export default router;