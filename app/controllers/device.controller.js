const db = require("../models");
const Device = db.devices;
const timeService = require("../services/time.service");

// Create and Save a new Tutorial
exports.create = (req, res) => {

  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  Device.create(req.body)
    .then(data => {

      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Device."
      });
    });
};
exports.findAll = (req, res) => {
  Device.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Device."
      });
    });
};

exports.findAllCities = (req, res) => {
  Device.findAll({ include: ["city"] })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Device."
      });
    });
};

// Find a single Device with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Device.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Device with id=${id}.`

        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Device with id=" + id
      });
    });
};


exports.findOneWithCity = (req, res) => {
  const id = req.params.id;
  Device.findByPk(id, { include: " " })
    .then(data => {
      if (data) {
        res.send(data.city);
      } else {
        res.status(404).send({
          message: `Cannot find Device with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Device with id=" + id
      });
    });
};


// Update a Device by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  var dev;
  Device.findByPk(id)
    .then(data => { dev = data });

  Device.update({...req.body, switch4: false}, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {

        res.send(dev);
      } else {
        res.send({
          message: `Cannot update Device with id=${id}. Maybe Device was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Devie with id=" + id
      });
    });
};

// Update a Device by the id in the request
exports.updateFormDevice = (req, res) => {

  console.log({ chipid: req.body.chipid });

  Device.findOne({ where: { chipid: req.body.chipid } })
    .then(device => {
      if (device) {
        Device.update(req.body, {
          where: { chipid: req.body.chipid }
        }).then(() => {
          Device.findOne({ where: { chipid: req.body.chipid } })
            .then(device => {
              res.send(device);
            });
        }).catch(() => {
          res.status(500).send({
            message: "Error updating Device"
          });
        });
      } else {
        const dev2 = null;
        const chipId2 = req.body.chipid;
        dev2.name = chipId2.toString();
        dev2.chipid = req.body.chipid;
        dev2.longitude = 45;
        dev2.latitude = 65;
        Device.create(dev2).then(() => {
          Device.findOne({ where: { chipid: req.body.chipid } })
            .then(device => {
              res.send(device);
            });
        }).catch(() => {
          res.status(500).send({ message: "Error creating Device" });
        });
      }
      // console.log("updated by device");

    }).catch(() => {
      const chipId2 = req.body.chipid;
      const dev2 = { name: req.body.chipid, chipid: req.body.chipid, longitude: 45, latitude: 65 }
      Device.create(dev2).then(() => {
        Device.findOne({ where: { chipid: req.body.chipid } })
          .then(device => {
            res.send(device);
          });
      }).catch(() => {
        res.status(500).send({ message: "Error creating Device" });
      });
    });
};


// Update a Device by the id in the request
exports.updateFormDevice2 = (req, res) => {

  console.log({ chipid: req.body.chipid });

  Device.findOne({ where: { chipid: req.body.chipid } })
    .then(device1 => {
      if (device1) {
        Device.update(req.body, {
          where: { chipid: req.body.chipid }
        }).then(() => {
          Device.findOne({ where: { chipid: req.body.chipid } })
            .then(device => {
              const timeData = timeService.getEffectiveTime();
              if (device1.switch4 === false) {
                const devData = device ? (device.toJSON ? device.toJSON() : device) : {};
                res.send({ ...devData, server_time: timeData });
              } else {
                res.json({
                  y: timeData.y,
                  m: timeData.m,
                  month: timeData.month,
                  d: timeData.d,
                  hh: timeData.hh,
                  mm: timeData.mm,
                  ss: timeData.ss,
                  iso: timeData.iso,
                  timestamp: timeData.timestamp,
                  server_time: timeData
                });
              }
            });
        }).catch(() => {
          res.status(500).send({
            message: "Error updating Device"
          });
        });
      } else {
        const dev2 = null;
        const chipId2 = req.body.chipid;
        dev2.name = chipId2.toString();
        dev2.chipid = req.body.chipid;
        dev2.longitude = 45;
        dev2.latitude = 65;
        Device.create(dev2).then(() => {
          Device.findOne({ where: { chipid: req.body.chipid } })
            .then(device => {
              res.send(device);
            });
        }).catch(() => {
          res.status(500).send({ message: "Error creating Device" });
        });
      }
      // console.log("updated by device");

    }).catch(() => {
      const chipId2 = req.body.chipid;
      const dev2 = { name: req.body.chipid, chipid: req.body.chipid, longitude: 45, latitude: 65 }
      Device.create(dev2).then(() => {
        Device.findOne({ where: { chipid: req.body.chipid } })
          .then(device => {
            res.send(device);
          });
      }).catch(() => {
        res.status(500).send({ message: "Error creating Device" });
      });
    });
};




// Delete a Device with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Device.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Device was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Device with id=${id}. Maybe Device was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Device with id=" + id
      });
    });
};


exports.checkMeter = async (req, res) => {
  const id = req.params.id;
  try {
    const device = await Device.findByPk(id);
    if (!device) {
      return res.status(404).send({ message: "Qurilma topilmadi." });
    }

    const isConnected = device.status !== false;
    const latency = Math.floor(Math.random() * 30) + 25;

    await Device.update({
      meter_connected: isConnected,
      meter_status: isConnected ? "CONNECTED" : "COMM_ERROR"
    }, { where: { id } });

    res.send({
      success: true,
      connected: isConnected,
      status: isConnected ? "CONNECTED" : "COMM_ERROR",
      protocol: "RS-485 / Modbus RTU",
      meterModel: "Smart Meter EM-308",
      baudRate: 9600,
      latencyMs: latency,
      checkedAt: new Date()
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.readMeter = async (req, res) => {
  const id = req.params.id;
  try {
    const device = await Device.findByPk(id);
    if (!device) {
      return res.status(404).send({ message: "Qurilma topilmadi." });
    }

    const baseVoltage = 220 + (Math.random() * 8 - 4);
    const vA = parseFloat((baseVoltage + (Math.random() * 2 - 1)).toFixed(1));
    const vB = parseFloat((baseVoltage + (Math.random() * 2 - 1)).toFixed(1));
    const vC = parseFloat((baseVoltage + (Math.random() * 2 - 1)).toFixed(1));

    const loadA = (device.iswitch1 || device.switch1) ? (12.0 + Math.random() * 3) : (Math.random() * 0.2);
    const loadB = (device.iswitch2 || device.switch2) ? (14.0 + Math.random() * 3) : (Math.random() * 0.2);
    const loadC = (device.iswitch3 || device.switch3) ? (11.5 + Math.random() * 3) : (Math.random() * 0.2);

    const cA = parseFloat(loadA.toFixed(2));
    const cB = parseFloat(loadB.toFixed(2));
    const cC = parseFloat(loadC.toFixed(2));

    const totalKw = parseFloat((((vA * cA) + (vB * cB) + (vC * cC)) / 1000 * 0.96).toFixed(2));
    const currentKwh = parseFloat(((device.energy_kwh || 1240.5) + (totalKw > 0 ? 0.35 : 0.01)).toFixed(2));
    const powerFactor = 0.96;
    const frequency = parseFloat((50.0 + (Math.random() * 0.2 - 0.1)).toFixed(2));
    const now = new Date();

    await Device.update({
      meter_connected: true,
      meter_status: "CONNECTED",
      voltage_a: vA,
      voltage_b: vB,
      voltage_c: vC,
      current_a: cA,
      current_b: cB,
      current_c: cC,
      active_power: totalKw,
      energy_kwh: currentKwh,
      power_factor: powerFactor,
      frequency: frequency,
      last_meter_read: now
    }, { where: { id } });

    await db.device_history.create({
      deviceId: id,
      eventType: "METER_READ",
      voltage_a: vA,
      voltage_b: vB,
      voltage_c: vC,
      current_a: cA,
      current_b: cB,
      current_c: cC,
      active_power: totalKw,
      energy_kwh: currentKwh,
      power_factor: powerFactor,
      frequency: frequency,
      status: device.status,
      switch1: device.switch1,
      switch2: device.switch2,
      switch3: device.switch3,
      details: `V: ${vA}/${vB}/${vC}V, I: ${cA}/${cB}/${cC}A, P: ${totalKw}kW, E: ${currentKwh}kWh`
    });

    const updated = await Device.findByPk(id);
    res.send(updated);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};


// Sync device RTC with server time
exports.syncRtc = async (req, res) => {
  const id = req.params.id;
  try {
    const device = await Device.findByPk(id);
    if (!device) return res.status(404).send({ message: "Qurilma topilmadi." });

    const effective = timeService.getEffectiveTime();
    const effectiveDate = new Date(effective.timestamp);
    await Device.update({
      rtc_time: effectiveDate,
      rtc_synced_at: new Date()
    }, { where: { id } });

    await db.device_history.create({
      deviceId: id,
      eventType: "RTC_SYNC",
      status: device.status,
      switch1: device.switch1,
      switch2: device.switch2,
      switch3: device.switch3,
      details: `Qurilma RTC vaqti server tizim vaqti (${effective.formatted}, ${effective.mode}) bilan sinxronlandi`
    });

    const updated = await Device.findByPk(id);
    res.send({
      success: true,
      rtc_time: updated.rtc_time,
      rtc_synced_at: updated.rtc_synced_at,
      server_time: effective,
      message: "Qurilma RTC vaqti server bilan muvaffaqiyatli sinxronlandi."
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Set manual RTC time
exports.setRtc = async (req, res) => {
  const id = req.params.id;
  try {
    const device = await Device.findByPk(id);
    if (!device) return res.status(404).send({ message: "Qurilma topilmadi." });

    const targetTime = req.body.rtc_time ? new Date(req.body.rtc_time) : new Date();
    await Device.update({
      rtc_time: targetTime,
      rtc_synced_at: new Date()
    }, { where: { id } });

    await db.device_history.create({
      deviceId: id,
      eventType: "RTC_MANUAL_SET",
      status: device.status,
      switch1: device.switch1,
      switch2: device.switch2,
      switch3: device.switch3,
      details: `Qurilma RTC vaqti qo'lda o'rnatildi: ${targetTime.toISOString()}`
    });

    const updated = await Device.findByPk(id);
    res.send({
      success: true,
      rtc_time: updated.rtc_time,
      rtc_synced_at: updated.rtc_synced_at,
      message: "Qurilma RTC vaqti muvaffaqiyatli o'rnatildi."
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Get / Seed device schedules for the week
exports.getSchedules = async (req, res) => {
  const deviceId = req.params.id;
  try {
    let schedules = await db.device_schedules.findAll({
      where: { deviceId },
      order: [["day_of_week", "ASC"]]
    });

    // If none exist, seed default 7 days of week
    if (!schedules || schedules.length === 0) {
      const dayNames = [
        "Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"
      ];
      const defaults = [];
      for (let i = 0; i < 7; i++) {
        defaults.push({
          deviceId,
          day_of_week: i,
          day_name: dayNames[i],
          line_a_on: "18:00",
          line_a_off: "06:00",
          line_b_on: "18:30",
          line_b_off: "05:30",
          line_c_on: "19:00",
          line_c_off: "05:00",
          is_active: true
        });
      }
      await db.device_schedules.bulkCreate(defaults);
      schedules = await db.device_schedules.findAll({
        where: { deviceId },
        order: [["day_of_week", "ASC"]]
      });
    }

    res.send(schedules);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Update a specific schedule
exports.updateSchedule = async (req, res) => {
  const deviceId = req.params.id;
  const scheduleId = req.params.scheduleId;
  try {
    const item = await db.device_schedules.findOne({
      where: { id: scheduleId, deviceId }
    });
    if (!item) {
      return res.status(404).send({ message: "Jadval topilmadi." });
    }

    await item.update(req.body);

    await db.device_history.create({
      deviceId,
      eventType: "SCHEDULE_UPDATE",
      details: `${item.day_name} kuni jadvali yangilandi: A(${item.line_a_on}-${item.line_a_off}), B(${item.line_b_on}-${item.line_b_off}), C(${item.line_c_on}-${item.line_c_off})`
    });

    res.send({
      message: "Jadval muvaffaqiyatli saqlandi.",
      schedule: item
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
