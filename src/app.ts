import express, { Application } from 'express';

const app: Application = express();

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'HR API is running ' });
});

export default app;
