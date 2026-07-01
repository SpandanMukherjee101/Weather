const axios = require('axios');
const User = require('../models/User');
const { normalizeText } = require('../utils/validation');

exports.getWeather = async (req, res, next) => {
  const city = normalizeText(req.body.city || req.query.city);

  if (!city) {
    return res.status(400).json({ message: 'City is required' });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.cities.includes(city)) {
      if (user.cities.length >= 3) {
        return res.status(400).json({ message: 'You can only store 3 cities' });
      }
      user.cities.push(city);
      await user.save();
    }

    if (!process.env.OPENWEATHER_API_KEY) {
      return res.status(500).json({ message: 'Weather service is not configured' });
    }

    const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
      params: {
        q: city,
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'metric',
      },
      timeout: 5000,
    });

    const weatherData = (weatherResponse.data.list || []).slice(0, 40).map((item) => ({
      date: item.dt_txt,
      maxTemp: item.main?.temp_max ?? 0,
      minTemp: item.main?.temp_min ?? 0,
      weatherType: item.weather?.[0]?.main || 'Clear',
      windSpeed: item.wind?.speed ?? 0,
      humidity: item.main?.humidity ?? 0,
      rainPercentage: item.rain?.['3h'] ?? 0,
    }));

    res.status(200).json(weatherData);
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ message: 'City not found' });
    }
    next(error);
  }
};

exports.updateCity = async (req, res, next) => {
  const oldCity = normalizeText(req.body.oldCity);
  const newCity = normalizeText(req.body.newCity);

  if (!oldCity || !newCity) {
    return res.status(400).json({ message: 'Both old and new city names are required' });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.cities.includes(oldCity)) {
      return res.status(404).json({ message: 'City not found in user list' });
    }

    const cityIndex = user.cities.indexOf(oldCity);
    user.cities[cityIndex] = newCity;
    await user.save();

    res.status(200).json({ message: 'City updated successfully', cities: user.cities });
  } catch (error) {
    next(error);
  }
};

exports.deleteCity = async (req, res, next) => {
  const city = normalizeText(req.body.city);

  if (!city) {
    return res.status(400).json({ message: 'City is required' });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.cities.includes(city)) {
      return res.status(404).json({ message: 'City not found in user list' });
    }

    user.cities = user.cities.filter((c) => c !== city);
    await user.save();

    res.status(200).json({ message: 'City deleted successfully', cities: user.cities });
  } catch (error) {
    next(error);
  }
};
