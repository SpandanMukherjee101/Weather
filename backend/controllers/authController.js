const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getJwtSecret } = require('../utils/authConfig');
const { normalizeText, isValidEmail, isStrongPassword } = require('../utils/validation');

exports.signup = async (req, res, next) => {
  const email = normalizeText(req.body.email);
  const password = req.body.password;

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character',
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    next(error);
  }
};

exports.signin = async (req, res, next) => {
  const email = normalizeText(req.body.email);
  const password = req.body.password;

  if (!isValidEmail(email) || !password) {
    return res.status(400).json({ message: 'Please provide a valid email and password' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ email: user.email, id: user._id }, getJwtSecret(), { expiresIn: '24h' });
    res.status(200).json({ result: token, user: { id: user._id, email: user.email } });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Old password and new password are required' });
  }

  if (!isStrongPassword(newPassword)) {
    return res.status(400).json({
      message: 'New password must be at least 8 characters and include uppercase, lowercase, a number, and a special character',
    });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Incorrect old password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};
