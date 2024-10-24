const express = require('express');
const { getUserCities } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/cities', authMiddleware, getUserCities);

module.exports = router;
