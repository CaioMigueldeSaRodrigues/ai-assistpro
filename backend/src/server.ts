import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupRoutes } from './routes/index.js';
import { setupCronJobs } from './services/cron.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const stateChangingMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function csrfGuard(configuredOrigin: string) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!stateChangingMethods.has(req.method) || !req.path.startsWith('/api/')) return next();

    const origin = req.header('origin');
    const referer = req.header('referer');
    const source = origin || referer;
    if (!source) return next();

    try {
      const sourceOrigin = new URL(source).origin;
      if (sourceOrigin !== configuredOrigin) {
        return res.status(403).json({ error: 'Cross-site request rejected' });
      }
    } catch {
      return res.status(403).json({ error: 'Invalid request origin' });
    }

    return next();
  };
}

export function createApp() {
  const app = express();
  const configuredOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

  app.disable('x-powered-by');
  app.use(cors({ origin: configuredOrigin, credentials: true }));
  app.use(express.json({ limit: '256kb' }));
  app.use(csrfGuard(configuredOrigin));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'ai-assistpro-backend', timestamp: new Date().toISOString() });
  });

  setupRoutes(app);
  app.use(errorHandler);
  return app;
}

export function startServer() {
  const port = Number(process.env.PORT || 3001);
  const app = createApp();
  return app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    setupCronJobs();
  });
}

if (process.env.NODE_ENV !== 'test') startServer();
