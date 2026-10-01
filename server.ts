import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
// @ts-ignore
import busArrivalHandler from './api/bus-arrival.js';
// @ts-ignore
import healthHandler from './api/health.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// API Routes
app.all('/api/bus-arrival', (req: Request, res: Response) => {
  return busArrivalHandler(req, res);
});

app.all('/api/busArrival', (req: Request, res: Response) => {
  return busArrivalHandler(req, res);
});

app.all('/api/health', (req: Request, res: Response) => {
  return healthHandler(req, res);
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
