import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { seedDatabase } from './services/seedData.js';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.resolve(__dirname, '../../frontend/dist');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-email', 'x-user-id'],
  })
);

// Rate limiter for general API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(morgan('dev'));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Apply rate limiter to /api
app.use('/api', apiLimiter);

// Mount API routes
app.use('/api', apiRoutes);

// Serve frontend static assets if built
if (fs.existsSync(frontendDist)) {
  console.log(`📦 Serving production frontend build from ${frontendDist}`);
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  // Root greeting fallback
  app.get('/', (req, res) => {
    res.json({
      message: 'NammaFix Civic Problem Reporting API is running',
      version: '1.0.0',
      docs: '/api/health',
      frontend: 'Frontend dist not built yet. Run "npm run build" to enable unified static serving.',
    });
  });
}

// Central Error Handler
app.use(errorHandler);

// Connect DB in background and start server immediately
async function startServer() {
  const server = app.listen(PORT, () => {
    console.log(`🚀 NammaFix Unified Application running at http://localhost:${PORT}`);
    console.log(`📡 API endpoints mounted at http://localhost:${PORT}/api`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${PORT} is already in use. Stop the existing process and restart.`);
    } else {
      console.error('Server error:', err);
    }
  });

  // Attempt database connection in background
  connectDB().then(async (db) => {
    if (db) {
      await seedDatabase();
    }
  }).catch((err) => {
    console.warn('⚠️ Database connection deferred:', err.message);
  });
}

startServer();
