const { OK } = require("../core/success.response");
const QueueService = require("../services/queue.service");

class QueueController {
    static async getQueueClinic(req, res) {
        return new OK({
            message: "Get queue clinic successfully",
            metadata: await QueueService.getQueueClinic(req.params.clinicId, req.query),
        }).send(res)
    }
}

module.exports = QueueController;
