const express = require('express');
const { getWeather, updateCity, deleteCity } = require('../controllers/weatherController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/', authMiddleware, getWeather);
router.put('/update-city', authMiddleware, updateCity);
router.delete('/delete-city', authMiddleware, deleteCity);
module.exports = router;