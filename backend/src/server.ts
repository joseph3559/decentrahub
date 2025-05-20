// src/server.ts
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

import app from './app';
import http from 'http';
import { connectDB, disconnectDB } from './config/db.config';

// ✅ Import all models to ensure they're registered with Sequelize
import './models/User.model'; // <-- add this (and any other models)

const PORT = process.env.PORT || 5001;

// ✅ Connect to DB before starting server
connectDB()
  .then(() => {
    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`Backend server is running on http://localhost:${PORT}`);
      console.log(`Node environment: ${process.env.NODE_ENV}`);
    });

    // Graceful shutdown
    const shutdown = () => {
      console.log('Shutdown signal received: closing HTTP server');
      server.close(async () => {
        console.log('HTTP server closed');
        await disconnectDB(); // ✅ close DB connection
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  })
  .catch((err) => {
    console.error('Failed to connect to DB:', err);
    process.exit(1);
  });
