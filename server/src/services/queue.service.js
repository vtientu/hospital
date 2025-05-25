const prisma = require("../config/prisma");

class QueueService {
    static async getQueueClinic(clinicId, query) {
        const { pageNumber = 1, pageSize = 10 } = query;

        if (!clinicId) {
            throw new Error("Clinic ID is required");
        }

        const clinic = await prisma.clinic.findUnique({
            where: {
                id: clinicId,
            },
        });

        if (!clinic) {
            throw new Error("Clinic not found");
        }

        const queueClinic = await prisma.queue.findMany({
            where: {
                clinic_id: clinicId,
                status: "pending",
            },
            orderBy: {
                priority: "desc",
                created_at: "desc",
            },
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
            include: {
                patient: true,
            },
        });

        const total = await prisma.queue.count({
            where: {
                clinic_id: clinicId,
                status: "pending",
            },
        });

        const totalPages = Math.ceil(total / pageSize);

        return { queueClinic, total, totalPages };
    }
}

module.exports = QueueService;
