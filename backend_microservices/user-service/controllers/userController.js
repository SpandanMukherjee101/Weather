const User = require('../models/User');

exports.getUserCities = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ cities: user.cities });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cities' });
  }
};