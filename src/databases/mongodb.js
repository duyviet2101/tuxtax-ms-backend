import mongoose from 'mongoose';
import config from "../../config.js";

const NODE_ENV = process.env.NODE_ENV;
const isProd = NODE_ENV === 'production';
const options = {
  // useCreateIndex: true,
  // useNewUrlParser: true,
  // useFindAndModify: false,
  autoIndex: isProd ? true : false, // Don't build indexes
  // reconnectTries: 5,
  // reconnectInterval: 2000, // Reconnect every 2s
  // poolSize: 4, // Maintain up to 4 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  // bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  dbName: config.MONGO_DB,
  user: config.MONGO_USER,
  pass: config.MONGO_PASS,
};

export const initializeMongoConnection = () => {
  mongoose
    .connect(config.MONGO_URL ? config.MONGO_URL : `mongodb://${config.MONGO_HOST}:${config.MONGO_PORT}`, options)
    .then(() => {
      console.log(`Connect to mongodb://${config.MONGO_HOST}:${config.MONGO_PORT} success.`);
    })
    .catch(error => {
      console.log(error);
    });
  // mongoose.plugin(builderFunc);

  mongoose.connection.on('connected', () => {
    console.log('MongoDb connected to db');
  })

  mongoose.connection.on('error', (e) => {
    console.log(e.message);
  })

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDb connected is disconnected');
  })

  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
  })
};
