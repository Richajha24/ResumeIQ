
const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error('MONGODB_URI is not configured in the .env file');
  }

  try {
    mongoose.set('strictQuery', false);

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000
    });

    isConnected = true;

    console.log(`[MongoDB] Connected: ${conn.connection.host}`);

    return conn;
  } catch (err) {
    isConnected = false;

    console.error('[MongoDB] Connection failed:', err.message);

    throw err;
  }
};

const getIsConnected = () => {
  return isConnected && mongoose.connection.readyState === 1;
};

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('[MongoDB] Disconnected');
});

mongoose.connection.on('connected', () => {
  isConnected = true;
});

module.exports = {
  connectDB,
  getIsConnected
};
