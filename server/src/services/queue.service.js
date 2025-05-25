const prisma = require("../config/prisma");

class QueueService {
    static async getQueueClinic(clinicId, query) {
        const { pageNumber = 1, pageSize = 10 } = query;

        if (!clinicId) {
            throw new Error("Clinic ID is required");
        }

        const clinic = await prisma.clinic.findUnique({
            where: {
                id: Number(clinicId),
            },
        });

        if (!clinic) {
            throw new Error("Clinic not found");
        }

        const queueClinic = await prisma.queue.findMany({
            where: {
                clinic_id: Number(clinicId),
                status: "waiting",
            },
            orderBy: [
                { priority: "desc" },
                { created_at: "desc" }
            ],
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
            include: {
                patient: true,
            },
        });

        const total = await prisma.queue.count({
            where: {
                clinic_id: Number(clinicId),
                status: "waiting",
            },
        });

        const totalPages = Math.ceil(total / pageSize);

        return { queueClinic, total, totalPages };
    }

    static async assignAdditionalClinic({ patient_id, to_clinic_id, record_id, priority = 0 }) {
        // Kiểm tra bệnh nhân đã có trong hàng đợi phòng này chưa
        const existing = await prisma.queue.findFirst({
            where: {
                patient_id,
                clinic_id: to_clinic_id,
                status: { in: ["waiting", "pending"] },
            },
        });
        if (existing) {
            throw new Error("Bệnh nhân đã có trong hàng đợi phòng này.");
        }
        // Tạo mới bản ghi queue
        const newQueue = await prisma.queue.create({
            data: {
                patient_id,
                clinic_id: to_clinic_id,
                record_id,
                status: "waiting",
                priority,
            },
        });
        return newQueue;
    }
}

module.exports = QueueService;
