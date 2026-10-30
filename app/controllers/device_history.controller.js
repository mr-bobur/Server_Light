const db = require("../models");
const DeviceHistory = db.device_history;

exports.findByDevice = async (req, res) => {
  const deviceId = req.params.deviceId;
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;
    const history = await DeviceHistory.findAll({
      where: { deviceId },
      order: [["createdAt", "DESC"]],
      limit
    });
    res.send(history);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Qurilma tarixini yuklashda xatolik yuz berdi."
    });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await DeviceHistory.create({
      ...req.body,
      deviceId: req.params.deviceId || req.body.deviceId
    });
    res.send(data);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
