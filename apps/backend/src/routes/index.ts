import type { Router as ExpressRouter } from 'express';
import { type Request, type Response, Router } from 'express';

import { agentsRouter } from './agents.js';

export const apiRouter: ExpressRouter = Router();

apiRouter.use('/agents', agentsRouter);

apiRouter.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Welcome to the API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      users: '/api/users',
    },
  });
});

apiRouter.get('/users', (_req: Request, res: Response) => {
  res.json({
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ],
  });
});

apiRouter.post('/users', (req: Request, res: Response) => {
  const { name, email } = req.body;

  res.status(201).json({
    message: 'User created successfully',
    user: {
      id: Math.floor(Math.random() * 1000),
      name,
      email,
    },
  });
});
