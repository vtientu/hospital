const express = require("express");
const queueRouter = express.Router();
const { authenticate } = require("../middlewares/authenticate");
const QueueController = require("../controllers/queue.controller");
const asyncHandler = require("../helper/asyncHandler");

queueRouter.use(authenticate);
queueRouter.get("/queue-clinic/:clinicId", asyncHandler(QueueController.getQueueClinic));

module.exports = queueRouter;
