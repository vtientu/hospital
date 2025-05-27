const prisma = require("../config/prisma");

class ClinicService {
  static async getAllClinics() {
    const clinics = await prisma.clinic.findMany();

    const newClinics = await Promise.all(
      clinics.map(async (clinic) => {
        const total = await prisma.queue.count({
          where: {
            clinic_id: Number(clinic.id),
            status: {
              in: ["waiting", "in_progress"],
            },
          },
        });
        clinic.patient_volume =
          total > 20 ? "high" : total > 10 ? "medium" : "low";
        return clinic;
      })
    );

    return newClinics;
  }
}

module.exports = ClinicService;
