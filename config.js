/* eslint-disable */
import 'dotenv/config.js';


const config = {
  ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3056,
  MONGO_USER: process.env.MONGO_USERNAME || '',
  MONGO_PASS: process.env.MONGO_PASSWORD || '',
  MONGO_HOST: process.env.MONGO_HOST || 'localhost',
  MONGO_PORT: process.env.MONGO_PORT || 27017,
  MONGO_DB: process.env.MONGO_DB || 'tuxtax_db',
  MONGO_URL: process.env.MONGO_URL ||  'mongodb://localhost:27017/tuxtax_db',
}

export default config;