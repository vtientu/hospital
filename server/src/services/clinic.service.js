const prisma = require("../config/prisma");

class ClinicService {
    static async getAllClinics() {
        const clinics = await prisma.clinic.findMany();
        return clinics;
    }
}

module.exports = ClinicService; 