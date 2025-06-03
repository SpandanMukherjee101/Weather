const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user');

dotenv.config();
const app = express();

app.use(express.json());
app.use('/', userRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(3002, () => console.log('User service running on port 3002'));
}).catch(console.error);
