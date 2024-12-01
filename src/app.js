import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { initializeMongoConnection } from "./databases/mongodb.js";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import basicAuth from "express-basic-auth";
//cors
import cors from "cors";
import config from "../config.js";
import {createServer} from "node:http";
import {Server} from "socket.io";
import {initializeSocket} from "./socket/index.js";

dotenv.config();

const app = express();

//!socket io
const server = createServer(app);
const io = initializeSocket(server);
global._io = io;

//! init middleware
app.use(cors());
app.use(morgan("dev")); //* app.use(morgan('combined'));
app.use(helmet()); //* che giấu thông tin header
app.use(compression()); //* giảm dung lượng trả về cho client
app.use(express.json()); //* parse json
app.use(
  express.urlencoded({
    extended: true,
  })
); //* parse urlencoded
//! end init middleware

//! init db
initializeMongoConnection();
//! end init db

//! init routes
app.use("/api", routes);
//! end init routes

const swaggerDefinition = {
  openapi: "3.0.0",
  version: "1.0",
  info: {
    title: "Tuxtax API",
    version: "1.0.0",
  },
  servers: [
    {
      url: `http://localhost:${config.PORT}/api`,
      description: "Development server",
    },
    // {
    //   url: 'htts://producttion.com/api',
    //   description: 'Production server'
    // },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    "./src/modules/helloWorld/helloWorld.route.js",
    "./src/modules/product/product.route.js",
    "./src/modules/users/users.route.js",
    "./src/modules/auth/auth.route.js",
    "./src/modules/categories/categories.route.js",
    "./src/modules/floors/floors.route.js",
    "./src/modules/tables/tables.route.js",
    "./src/modules/orders/order.route.js",
  ],
};

const swaggerSpec = swaggerJsDoc(options);
app.use(
  "/api-docs",
  basicAuth({
    users: { tuxtax: "tuxtax" },
    challenge: true,
  }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
  })
);

//! handle error
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    status: "error",
    code: error.status || 500,
    message: error.message || "Internal Server Error",
    stack: error.status === 500 ? error.stack : "",
  });
});
//! end handle error

export default server;
