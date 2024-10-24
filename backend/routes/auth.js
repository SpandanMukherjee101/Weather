const express = require('express');
const { signup, signin, changePassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.put('/change-password', authMiddleware, changePassword);

module.exports = router;
