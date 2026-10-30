const db = require("../models");
const City = db.cities;
const Device = db.devices;
const Users = db.user;
const Op = db.Sequelize.Op;
const { calculateSunTimes } = require("../utils/solar");

// Create and Save a new City
exports.create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: "Shahar nomi kiritilishi shart!"
    });
    return;
  }

  const lat = req.body.latitude || 41.2995;
  const lng = req.body.longitude || 69.2401;
  const sun = calculateSunTimes(lat, lng, new Date(), 5);

  const city = {
    name: req.body.name,
    longitude: lng,
    latitude: lat,
    sunrise: sun.sunriseDate,
    sunset: sun.sunsetDate,
    automatic: req.body.automatic || false
  };

  City.create(city)
    .then(data => {
      // Create initial history record
      db.city_history.create({
        cityId: data.id,
        action: "SHAHAR_YARATILDI",
        automatic: data.automatic,
        details: `Yangi shahar yaratildi: ${data.name} (${lat}, ${lng})`,
        changedBy: req.user?.username || "Administrator"
      }).catch(() => {});

      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Shaharni yaratishda xatolik yuz berdi."
      });
    });
};

// Retrieve all cities from the database
exports.findAll = (req, res) => {
  City.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Shaharlarni olishda xatolik."
      });
    });
};

// For just users
exports.findAll2 = (req, res) => {
  const id = req.params.cityid;
  Users.findByPk(id)
    .then(data => {
      data.getCities().then(cities => {
        res.send(cities);
      });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving cities with id=" + id
      });
    });
};

// Find a single City with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  City.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Shahar topilmadi id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving City with id=" + id
      });
    });
};

// Find a single City with devices
exports.findOneWithDevice = (req, res) => {
  const id = req.params.id;
  City.findByPk(id, { include: ["devices"] })
    .then(data => {
      if (data) {
        res.send(data.devices);
      } else {
        res.status(404).send({
          message: `Shahar topilmadi id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving City with id=" + id
      });
    });
};

exports.findUsers = (req, res) => {
  const id = req.params.id;
  City.findByPk(id)
    .then(data => {
      data.getUsers().then(users => {
        res.send(users);
      });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Users with id=" + id
      });
    });
};

// Update a City by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const existing = await City.findByPk(id);
    if (!existing) {
      return res.status(404).send({ message: `Shahar topilmadi id=${id}.` });
    }

    // If coordinates changed or sunrise/sunset requested, re-calculate
    let updateData = { ...req.body };
    const lat = updateData.latitude || existing.latitude;
    const lng = updateData.longitude || existing.longitude;
    const sun = calculateSunTimes(lat, lng, new Date(), 5);
    updateData.sunrise = sun.sunriseDate;
    updateData.sunset = sun.sunsetDate;

    await City.update(updateData, { where: { id: id } });

    // Generate meaningful audit details
    const changes = [];
    if (req.body.automatic !== undefined && req.body.automatic !== existing.automatic) {
      changes.push(`Rejim: ${req.body.automatic ? "Avtomatik" : "Qo'lda"}`);
    }
    if (req.body.name && req.body.name !== existing.name) {
      changes.push(`Nomi: ${req.body.name}`);
    }
    if (req.body.latitude && req.body.latitude !== existing.latitude) {
      changes.push(`Lat: ${req.body.latitude}`);
    }
    if (req.body.longitude && req.body.longitude !== existing.longitude) {
      changes.push(`Lng: ${req.body.longitude}`);
    }
    if (req.body.rasp1 !== undefined) {
      changes.push(`Liniya A: ${req.body.rasp1 ? "Jadval (Raspisaniya)" : "Avto"}`);
    }
    if (req.body.rasp2 !== undefined) {
      changes.push(`Liniya B: ${req.body.rasp2 ? "Jadval (Raspisaniya)" : "Avto"}`);
    }
    if (req.body.rasp3 !== undefined) {
      changes.push(`Liniya C: ${req.body.rasp3 ? "Jadval (Raspisaniya)" : "Avto"}`);
    }

    // Save to city_history
    await db.city_history.create({
      cityId: id,
      action: changes.length > 0 ? "SOZLAMALAR_O'ZGARISHI" : "TIZIM_YANGILANISHI",
      automatic: updateData.automatic !== undefined ? updateData.automatic : existing.automatic,
      details: changes.length > 0 ? changes.join("; ") : "Shahar sozlamalari saqlandi",
      changedBy: req.user?.username || "boburshah"
    });

    const updated = await City.findByPk(id);
    res.send({
      message: "City was updated successfully.",
      city: updated
    });
  } catch (err) {
    res.status(500).send({
      message: "Error updating City with id=" + id + ": " + err.message
    });
  }
};

// Delete a City
exports.delete = (req, res) => {
  const id = req.params.id;

  City.destroy({ where: { id: id } })
    .then(num => {
      if (num == 1) {
        res.send({ message: "City was deleted successfully!" });
      } else {
        res.send({ message: `Cannot delete City with id=${id}. Maybe City was not found!` });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete City with id=" + id
      });
    });
};

// Get Astronomical Solar Times for a City
exports.getAstronomy = async (req, res) => {
  const id = req.params.id;
  try {
    const city = await City.findByPk(id);
    if (!city) {
      return res.status(404).send({ message: "Shahar topilmadi." });
    }

    const sun = calculateSunTimes(city.latitude || 41.2995, city.longitude || 69.2401, new Date(), 5);

    // Keep DB updated
    await city.update({
      sunrise: sun.sunriseDate,
      sunset: sun.sunsetDate
    });

    res.send({
      cityId: city.id,
      cityName: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
      sunrise: sun.sunriseStr,
      sunset: sun.sunsetStr,
      solarNoon: sun.solarNoonStr,
      dayLength: sun.dayLength,
      timezone: "UTC+5 (Toshkent)",
      date: new Date().toISOString().substring(0, 10)
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Get History / Audit Journal for a City
exports.getHistory = async (req, res) => {
  const cityId = req.params.id;
  try {
    const history = await db.city_history.findAll({
      where: { cityId },
      order: [["createdAt", "DESC"]]
    });
    res.send(history);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Create a Manual History Log for a City
exports.createHistory = async (req, res) => {
  const cityId = req.params.id;
  try {
    const item = await db.city_history.create({
      cityId,
      action: req.body.action || "MANUAL_LOG",
      automatic: req.body.automatic || false,
      details: req.body.details || "Qo'lda kiritilgan yozuv",
      changedBy: req.user?.username || "Administrator"
    });
    res.send(item);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
