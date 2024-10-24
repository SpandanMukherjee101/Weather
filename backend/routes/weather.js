const express = require('express');
const { getWeather, updateCity, deleteCity } = require('../controllers/weatherController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, getWeather);
router.put('/update-city', authMiddleware, updateCity); // New route for updating a city
router.delete('/delete-city', authMiddleware, deleteCity); // New route for deleting a city

module.exports = router;
