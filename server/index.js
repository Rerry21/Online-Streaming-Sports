import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import sportsRoutes from './routes/sports.js';
import matchesRoutes from './routes/matches.js';
import streamRoutes from './routes/stream.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(express.json());

app.use(
  express.static(
    path.join(process.cwd(), '../client/dist')
  )
);

app.use('/api', sportsRoutes);
app.use('/api', matchesRoutes);
app.use('/api', streamRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'matchday-api'
  });
});

app.use('/api', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found.'
  });
});

app.use((err, req, res, next) => {
  console.error(
    'Unhandled server error:',
    err
  );

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    error:
      'Something went wrong on the Matchday server.'
  });
});

app.listen(
  PORT,
  '0.0.0.0',
  () => {
    console.log(
      `🚀 Matchday server running on http://localhost:${PORT}`
    );

    console.log(
      `🌐 Network: http://192.168.0.101:${PORT}`
    );

    console.log(
      `   • Health: http://192.168.0.101:${PORT}/api/health`
    );

    console.log(
      `   • Sports: http://192.168.0.101:${PORT}/api/sports`
    );

    console.log(
      `   • Matches: http://192.168.0.101:${PORT}/api/matches`
    );

    console.log(
      `   • Live: http://192.168.0.101:${PORT}/api/matches/live`
    );
  }
);``