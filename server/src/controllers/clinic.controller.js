const { OK } = require("../core/success.response");
const ClinicService = require("../services/clinic.service");

class ClinicController {
    static async getAllClinics(req, res) {
        return new OK({
            message: "Get all clinics successfully",
            metadata: await ClinicService.getAllClinics(),
        }).send(res);
    }
}

module.exports = ClinicController; 