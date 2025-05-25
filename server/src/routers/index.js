const express = require("express");
const router = express.Router();
const authRouter = require("./auth.route");
const clinicRouter = require("./clinic.route");
const queueRouter = require("./queue.route");

router.use("/auth", authRouter);
router.use("/clinics", clinicRouter);
router.use("/queues", queueRouter);

module.exports = router;