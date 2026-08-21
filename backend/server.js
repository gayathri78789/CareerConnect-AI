import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dns from 'dns';
import apiRoutes from './routes/apiRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory or root directory
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Configure Node DNS for local environment if needed
if (process.env.NODE_ENV !== 'production') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (err) {
    // Ignore DNS set failure
  }
}

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api', apiRoutes);

const distPath = path.resolve(__dirname, '../dist');
const indexPath = fs.existsSync(path.join(distPath, 'index.html'))
  ? path.join(distPath, 'index.html')
  : path.resolve(__dirname, '../index.html');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(indexPath);
});

async function startServer() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB connected');
    } catch (error) {
      console.warn('⚠️  MongoDB connection failed:', error.message);
    }
  } else {
    console.warn('⚠️  MONGODB_URI is not set. Skipping MongoDB connection.');
  }

  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 PrepPilot API running on http://0.0.0.0:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Close the existing process or set a different PORT in your .env file.`);
      process.exit(1);
    }
    throw error;
  });
}

startServer();
