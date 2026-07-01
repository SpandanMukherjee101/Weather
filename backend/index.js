const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const weatherRoutes = require('./routes/weather');
const { connectToDatabase } = require('./utils/dbConnection');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  'https://weather-sm.vercel.app',
  'http://localhost:3000',
  'http://127.0.0.1:5500',
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

app.get('/', (req, res) => res.json({ message: 'Weather API is running' }));
app.get('/health', async (req, res) => {
  try {
    await connectToDatabase();
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    res.status(503).json({ status: 'db-unavailable', message: error.message });
  }
});
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/weather', weatherRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal server error',
  });
});

const startServer = async () => {
  try {
    await connectToDatabase();
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    const shutdown = async (signal) => {
      console.log(`Received ${signal}. Closing server...`);
      server.close(async () => {
        await mongoose.disconnect();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
