const prisma = require("../config/prisma");

class ExaminationDetailService {
    static async create(data) {
        try {
            const {
                to_clinic_id,
                from_clinic_id,
                doctor_id,
                result,
                note,
                examined_at,
                status,
                clinic_id,
                patient_id,
                total_cost
            } = data;
            // Lấy record để lấy patient_id
            const record = await prisma.examinationRecord.findFirst({
                where: { patient_id: patient_id, final_diagnosis: null },
            });
            if (!record) throw new Error("Không tìm thấy hồ sơ khám");

            const detail = await prisma.examinationDetail.create({
                data: {
                    record_id: record.id,
                    clinic_id,
                    doctor_id,
                    result,
                    note,
                    examined_at,
                    status,
                }
            });

            if (to_clinic_id && from_clinic_id && doctor_id) {
                await prisma.examinationOrder.create({
                    data: {
                        doctor_id,
                        patient_id: record.patient_id,
                        from_clinic_id,
                        to_clinic_id,
                        total_cost: total_cost || 0,
                    },
                });
            }

            await prisma.queue.updateMany({
                where: {
                    patient_id: patient_id,
                    status: { in: ["waiting", "in_progress"] }
                },
                data: {
                    status: "done",
                },
            }); 

            await prisma.queue.create({
                data: {
                    patient_id: patient_id,
                    status: "waiting",
                    clinic_id: to_clinic_id,
                    priority: 1,
                },
            });

            return detail;
        } catch (error) {
            throw new Error(error);
        }
    }

    static async update(id, data) {
        return prisma.examinationDetail.update({
            where: { id: Number(id) },
            data,
        });
    }

    static async getById(id) {
        return prisma.examinationDetail.findUnique({
            where: { id: Number(id) },
            include: {
                record: true,
                clinic: true,
                doctor: true,
            },
        });
    }

    static async getAll(query = {}) {
        return prisma.examinationDetail.findMany({
            where: query,
            include: {
                record: true,
                clinic: true,
                doctor: true,
            },
            orderBy: { examined_at: "desc" },
        });
    }
}

module.exports = ExaminationDetailService; 