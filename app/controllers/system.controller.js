const timeService = require("../services/time.service");
const db = require("../models");

exports.getTime = (req, res) => {
  try {
    const timeData = timeService.getEffectiveTime();
    res.json(timeData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.setTime = async (req, res) => {
  try {
    const { mode, targetDateTime, offsetSeconds } = req.body;
    const updatedBy = (req.user && req.user.username) ? req.user.username : (req.body.updatedBy || "admin");

    const result = await timeService.setSystemTime({
      mode,
      targetDateTime,
      offsetSeconds,
      updatedBy
    });

    // Optionally create history record if devices table exists
    try {
      if (db.device_history) {
        await db.device_history.create({
          eventType: "SYSTEM_TIME_UPDATE",
          details: `Tizim vaqti ${result.mode} rejimiga o'zgartirildi. Vaqt: ${result.formatted} (Offset: ${result.offsetSeconds}s)`
        });
      }
    } catch (e) {
      // ignore history error if not critical
    }

    res.json({
      success: true,
      message: "Tizim vaqti muvaffaqiyatli yangilandi va barcha qurilmalarga yo'naltirildi.",
      data: result
    });
  } catch (err) {
    res.status(400).json({ message: err.message || "Tizim vaqtini o'rnatishda xatolik yuz berdi." });
  }
};

exports.resetTime = async (req, res) => {
  try {
    const updatedBy = (req.user && req.user.username) ? req.user.username : "admin";
    const result = await timeService.resetToAuto(updatedBy);

    res.json({
      success: true,
      message: "Tizim vaqti avtomatik server vaqtiga qaytarildi.",
      data: result
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
