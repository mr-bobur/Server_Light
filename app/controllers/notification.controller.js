const db = require("../models");
const Notification = db.notifications;

exports.findAll = async (req, res) => {
  try {
    const condition = {};
    if (req.query.unread === "true") {
      condition.isRead = false;
    }
    if (req.query.cityId) {
      condition.cityId = req.query.cityId;
    }

    const data = await Notification.findAll({
      where: condition,
      order: [["createdAt", "DESC"]],
      limit: req.query.limit ? parseInt(req.query.limit) : 50,
      include: [
        {
          model: db.devices,
          as: "device",
          attributes: ["id", "name", "status"]
        }
      ]
    });

    const unreadCount = await Notification.count({ where: { isRead: false } });

    res.send({ notifications: data, unreadCount });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Xabarlarni yuklashda xatolik yuz berdi."
    });
  }
};

exports.markAsRead = async (req, res) => {
  const id = req.params.id;
  try {
    await Notification.update({ isRead: true }, { where: { id } });
    res.send({ message: "Xabar o'qildi deb belgilandi." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.update({ isRead: true }, { where: { isRead: false } });
    res.send({ message: "Barcha xabarlar o'qildi deb belgilandi." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, message, type, deviceId, cityId } = req.body;
    if (!title || !message) {
      return res.status(400).send({ message: "Sarlavha va xabar matni bo'sh bo'lishi mumkin emas." });
    }
    const created = await Notification.create({
      title,
      message,
      type: type || "info",
      deviceId: deviceId || null,
      cityId: cityId || null
    });
    res.send(created);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    await Notification.destroy({ where: { id } });
    res.send({ message: "Xabar muvaffaqiyatli o'chirildi." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
