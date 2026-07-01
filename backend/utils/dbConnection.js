const mongoose = require('mongoose');

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined');
  }

  return mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10,
  });
}

module.exports = {
  connectToDatabase,
};
