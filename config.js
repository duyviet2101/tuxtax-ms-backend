/* eslint-disable */
import 'dotenv/config.js';
import {THIRTY_DAYS} from "./src/constants/auth.js";


const config = {
  ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3056,
  MONGO_USER: process.env.MONGO_USERNAME || '',
  MONGO_PASS: process.env.MONGO_PASSWORD || '',
  MONGO_HOST: process.env.MONGO_HOST || 'localhost',
  MONGO_PORT: process.env.MONGO_PORT || 27017,
  MONGO_DB: process.env.MONGO_DB || 'tuxtax-db',
  MONGO_URL: process.env.MONGO_URL ||  'mongodb://localhost:27017/tuxtax-db',
  ACCESS_TOKEN_LIFETIME: process.env.ACCESS_TOKEN_LIFETIME || THIRTY_DAYS,
  REFRESH_TOKEN_LIFETIME: process.env.REFRESH_TOKEN_LIFETIME || THIRTY_DAYS,
  JWT_SECRET: process.env.JWT_SECRET || 'very-secret',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'very-very-secret',
  CLOUD_NAME: process.env.CLOUD_NAME || '',
  CLOUD_KEY: process.env.CLOUD_KEY || '',
  CLOUD_SECRET: process.env.CLOUD_SECRET || '',
}

export default config;