const express = require("express");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const router = require("./routers/index");
const { globalErrorHandler } = require("./middlewares/errorHandler");
const { initSocket } = require("./config/socket");
const http = require("http");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Khởi tạo socket
initSocket(server);

// Routes
app.use("/api/v1", router);

// Error handler
app.use(globalErrorHandler);

module.exports = app;