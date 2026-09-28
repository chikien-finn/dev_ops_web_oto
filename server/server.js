import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import carRoutes from './routes/cars.js';
import bookingRoutes from './routes/bookings.js';
import userRoutes from './routes/users.js';
import favoriteRoutes from './routes/favorites.js';
import { initializeDatabase } from './config/db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logger for debugging & devops logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Health check endpoint (Crucial for Docker health check & CI/CD smoke test)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'AutoPremium API',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favorites', favoriteRoutes);

// 404 Route Handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `Endpoint ${req.originalUrl} không tồn tại trên hệ thống API.` });
});

// Global Error Handler
app.use((err, req, res, _next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Đã xảy ra lỗi nội bộ máy chủ.',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

import { fileURLToPath } from 'url';

const isMainModule = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

// Start server if run directly
if (isMainModule) {
  app.listen(PORT, async () => {
    await initializeDatabase();
    console.log(`🚀 AutoPremium Backend API đang chạy tại http://localhost:${PORT}`);
    console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
  });
}

export default app;
