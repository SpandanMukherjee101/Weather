const User = require('../models/User');  // Assuming you have a User model

// Get saved cities for the authenticated user
exports.getUserCities = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the list of saved cities for the user
        res.status(200).json({ cities: user.cities });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cities' });
    }
};
