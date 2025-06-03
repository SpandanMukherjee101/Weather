const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const proxy = require('express-http-proxy');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", proxy("http://localhost:3001"));
app.use("/user", proxy("http://localhost:3002"));
app.use("/weather", proxy("http://localhost:3003"));

app.listen(3000, () => console.log('API Gateway running on port 3000'));
//{ origin: 'https://weather-sm.vercel.app', credentials: true }