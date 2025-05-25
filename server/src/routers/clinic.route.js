const express = require("express");
const clinicRouter = express.Router();
const authenticate = require("../middlewares/authenticate");
const ClinicController = require("../controllers/clinic.controller");
const asyncHandler = require("../helper/asyncHandler");

// clinicRouter.use(authenticate);
clinicRouter.get("/", asyncHandler(ClinicController.getAllClinics));

module.exports = clinicRouter; 