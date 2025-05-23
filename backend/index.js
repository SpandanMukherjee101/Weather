const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const weatherRoutes = require('./routes/weather');

dotenv.config();

const app = express();
app.use(cors({
  origin: 'https://weather-sm.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

app.get("/", (req, res) => res.send("Express on Vercel"));
app.use('/auth', authRoutes);
app.use('/user', userRoutes)
app.use('/weather', weatherRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(3000, () => console.log("Server running on port 3000")))
  .catch(err => console.error(err));
