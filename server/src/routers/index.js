const express = require("express");
const router = express.Router();
const authRouter = require("./auth.route");
const clinicRouter = require("./clinic.route");
const queueRouter = require("./queue.route");
const examinationRecordRouter = require("./examinationRecord.route");
const examinationDetailRouter = require("./examinationDetail.route");
const examinationOrderRouter = require("./examinationOrder.route");

router.use("/auth", authRouter);
router.use("/clinics", clinicRouter);
router.use("/queues", queueRouter);
router.use("/examination-records", examinationRecordRouter);
router.use("/examination-details", examinationDetailRouter);
router.use("/examination-orders", examinationOrderRouter);

module.exports = router;