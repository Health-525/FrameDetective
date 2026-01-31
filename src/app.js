import express from 'express';
import cors from 'cors';
import path from 'path';
import apiRoutes from './routes/api.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static Files
app.use(express.static(path.join(process.cwd(), 'public'), {
  etag: false,
  lastModified: false,
  cacheControl: true,
  maxAge: 0
}));

// API Routes
app.use('/api', apiRoutes);

// Error Handling Middleware (Basic)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;