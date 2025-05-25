const { OK } = require("../core/success.response");
const QueueService = require("../services/queue.service");

class QueueController {
    static async getQueueClinic(req, res) {
        return new OK({
            message: "Get queue clinic successfully",
            metadata: await QueueService.getQueueClinic(req.params.clinicId, req.query),
        }).send(res)
    }

    static async assignAdditionalClinic(req, res) {
        return new OK({
            message: "Assign additional clinic successfully",
            metadata: await QueueService.assignAdditionalClinic(req.body),
        }).send(res);
    }
}

module.exports = QueueController;
