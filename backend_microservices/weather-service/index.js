const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const weatherRoutes = require('./routes/weather');

dotenv.config();
const app = express();

app.use(express.json());
app.use('/', weatherRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(3003, () => console.log('Weather service running on port 3003'));
}).catch(console.error);