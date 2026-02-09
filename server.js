import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Route imports
import userRoutes from './routes/userRoutes.js';
import foodListingRoutes from './routes/foodListingRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import ngoRoutes from './routes/ngoRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';

// Middleware imports
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/food-listings', foodListingRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/ngos', ngoRoutes);
app.use('/api/ratings', ratingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
