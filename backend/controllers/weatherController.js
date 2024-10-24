const axios = require('axios');
const User = require('../models/User');

exports.getWeather = async (req, res) => {
  const { city } = req.body;
  const user = await User.findById(req.userId);
  
  if (!user.cities.includes(city)) {
    if (user.cities.length >= 3) return res.status(400).json({ message: "You can only store 3 cities" });
    user.cities.push(city);
    await user.save();
  }

  try {
    const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`);
    const weatherData = weatherResponse.data.list.slice(0, 40).map(item => ({
      date: item.dt_txt,
      maxTemp: item.main.temp_max,
      minTemp: item.main.temp_min,
      weatherType: item.weather[0].main,
      windSpeed: item.wind.speed,
      humidity: item.main.humidity,
      rainPercentage: item.rain ? item.rain["3h"] : 0,
    }));

    res.status(200).json(weatherData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching weather data" });
  }
};

exports.updateCity = async (req, res) => {
  const { oldCity, newCity } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user.cities.includes(oldCity)) {
      return res.status(404).json({ message: "City not found in user's list" });
    }

    const cityIndex = user.cities.indexOf(oldCity);
    user.cities[cityIndex] = newCity;
    await user.save();

    res.status(200).json({ message: "City updated successfully", cities: user.cities });
  } catch (error) {
    res.status(500).json({ message: "Error updating city" });
  }
};

exports.deleteCity = async (req, res) => {
  const { city } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user.cities.includes(city)) {
      return res.status(404).json({ message: "City not found in user's list" });
    }

    user.cities = user.cities.filter(c => c !== city);
    await user.save();

    res.status(200).json({ message: "City deleted successfully", cities: user.cities });
  } catch (error) {
    res.status(500).json({ message: "Error deleting city" });
  }
};
