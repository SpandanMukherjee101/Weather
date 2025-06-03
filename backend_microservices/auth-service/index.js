const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config();
const app = express();

app.use(express.json());

app.use('/', authRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(3001, () => console.log('Auth service running on port 3001'));
}).catch(console.error);