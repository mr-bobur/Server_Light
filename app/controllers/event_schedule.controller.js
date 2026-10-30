const db = require("../models");
const EventSchedule = db.event_schedules;
const Device = db.devices;
const City = db.cities;
const timeService = require("../services/time.service");
const { Op } = require("sequelize");

// Helper to determine status based on effective server time
function getScheduleStatus(sched, effectiveDateStr) {
  if (!sched.isActive) return "DISABLED";
  if (effectiveDateStr < sched.startDate) return "UPCOMING";
  if (effectiveDateStr > sched.endDate) return "EXPIRED";
  return "ACTIVE";
}

// 1. Get all event schedules
exports.getAllEvents = async (req, res) => {
  try {
    const { cityId } = req.query;
    const effectiveTime = timeService.getEffectiveTime();
    const effectiveDateStr = effectiveTime.dateFormatted; // "YYYY-MM-DD"

    const where = {};
    if (cityId) {
      where[Op.or] = [{ cityId: null }, { cityId: cityId }];
    }

    const list = await EventSchedule.findAll({
      where,
      order: [["priority", "DESC"], ["startDate", "ASC"]]
    });

    const parsed = list.map(item => {
      const data = item.toJSON();
      let devIds = [];
      try {
        devIds = JSON.parse(data.deviceIds || "[]");
      } catch (e) {
        devIds = [];
      }
      data.parsedDeviceIds = Array.isArray(devIds) ? devIds : [];
      data.calculatedStatus = getScheduleStatus(data, effectiveDateStr);
      
      // Calculate days remaining or days until start
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      const now = new Date(effectiveDateStr);
      
      if (data.calculatedStatus === "ACTIVE") {
        const diffMs = end.getTime() - now.getTime();
        data.daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      } else if (data.calculatedStatus === "UPCOMING") {
        const diffMs = start.getTime() - now.getTime();
        data.daysUntilStart = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      }

      return data;
    });

    res.json(parsed);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Create new event schedule
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      type,
      description,
      startDate,
      endDate,
      priority,
      isActive,
      cityId,
      deviceIds,
      line_a_mode,
      line_a_on,
      line_a_off,
      line_b_mode,
      line_b_on,
      line_b_off,
      line_c_mode,
      line_c_on,
      line_c_off,
      dimming,
      color_mode
    } = req.body;

    if (!title || !startDate || !endDate) {
      return res.status(400).json({ message: "Sarlavha, boshlanish va tugash sanasi talab qilinadi." });
    }

    const createdBy = req.user ? req.user.username : (req.body.created_by || "admin");
    const serializedDevIds = Array.isArray(deviceIds) ? JSON.stringify(deviceIds) : (deviceIds || "[]");

    const newRecord = await EventSchedule.create({
      title,
      type: type || "HOLIDAY",
      description,
      startDate,
      endDate,
      priority: Number(priority) || 10,
      isActive: isActive !== false,
      cityId: cityId || null,
      deviceIds: serializedDevIds,
      line_a_mode: line_a_mode || "SCHEDULE",
      line_a_on: line_a_on || "18:00",
      line_a_off: line_a_off || "06:00",
      line_b_mode: line_b_mode || "SCHEDULE",
      line_b_on: line_b_on || "18:30",
      line_b_off: line_b_off || "03:00",
      line_c_mode: line_c_mode || "SCHEDULE",
      line_c_on: line_c_on || "19:00",
      line_c_off: line_c_off || "02:00",
      dimming: Number(dimming) || 100,
      color_mode: color_mode || "DEFAULT",
      created_by: createdBy
    });

    res.status(201).json({
      success: true,
      message: "Maxsus bayram/tadbir skedjuli muvaffaqiyatli yaratildi.",
      data: newRecord
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Update event schedule
exports.updateEvent = async (req, res) => {
  try {
    const id = req.params.id;
    const schedule = await EventSchedule.findByPk(id);
    if (!schedule) {
      return res.status(404).json({ message: "Skedjul topilmadi." });
    }

    const updateData = { ...req.body };
    if (Array.isArray(updateData.deviceIds)) {
      updateData.deviceIds = JSON.stringify(updateData.deviceIds);
    }

    await schedule.update(updateData);

    res.json({
      success: true,
      message: "Skedjul ma'lumotlari yangilandi.",
      data: schedule
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. Delete event schedule
exports.deleteEvent = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await EventSchedule.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: "Skedjul topilmadi." });
    }
    res.json({ success: true, message: "Skedjul o'chirildi." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 5. Get effective schedule for a specific device right now
exports.getEffectiveDeviceSchedule = async (req, res) => {
  try {
    const deviceId = Number(req.params.id);
    const device = await Device.findByPk(deviceId, { include: ["city"] });
    if (!device) {
      return res.status(404).json({ message: "Qurilma topilmadi." });
    }

    const effectiveTime = timeService.getEffectiveTime();
    const effectiveDateStr = effectiveTime.dateFormatted; // "YYYY-MM-DD"

    // Search for active event schedules that cover this date
    const candidateEvents = await EventSchedule.findAll({
      where: {
        isActive: true,
        startDate: { [Op.lte]: effectiveDateStr },
        endDate: { [Op.gte]: effectiveDateStr }
      },
      order: [["priority", "DESC"]]
    });

    // Find the highest priority event matching this device
    let matchingEvent = null;
    for (const evt of candidateEvents) {
      let devIds = [];
      try {
        devIds = JSON.parse(evt.deviceIds || "[]");
      } catch (e) {}

      const appliesToAllCity = evt.deviceIds === "*" || (evt.cityId && evt.cityId === device.cityId && devIds.length === 0);
      const isDeviceIncluded = Array.isArray(devIds) && devIds.map(Number).includes(deviceId);

      if (appliesToAllCity || isDeviceIncluded) {
        matchingEvent = evt;
        break; // First one is highest priority
      }
    }

    if (matchingEvent) {
      return res.json({
        deviceId,
        deviceName: device.name,
        effectiveDate: effectiveDateStr,
        source: "EVENT_OVERRIDE",
        priority: matchingEvent.priority,
        event: {
          id: matchingEvent.id,
          title: matchingEvent.title,
          type: matchingEvent.type,
          startDate: matchingEvent.startDate,
          endDate: matchingEvent.endDate
        },
        lines: {
          a: { mode: matchingEvent.line_a_mode, on: matchingEvent.line_a_on, off: matchingEvent.line_a_off },
          b: { mode: matchingEvent.line_b_mode, on: matchingEvent.line_b_on, off: matchingEvent.line_b_off },
          c: { mode: matchingEvent.line_c_mode, on: matchingEvent.line_c_on, off: matchingEvent.line_c_off }
        },
        dimming: matchingEvent.dimming,
        color_mode: matchingEvent.color_mode
      });
    }

    // Fallback to City default astronomical schedule
    const city = device.city;
    return res.json({
      deviceId,
      deviceName: device.name,
      effectiveDate: effectiveDateStr,
      source: "CITY_DEFAULT",
      city: city ? {
        id: city.id,
        name: city.name,
        sunrise: city.sunrise,
        sunset: city.sunset,
        automatic: city.automatic
      } : null,
      lines: {
        a: { mode: "ASTRONOMICAL", on: city ? city.ontime1 : "18:00", off: city ? city.offtime1 : "06:00" },
        b: { mode: "ASTRONOMICAL", on: city ? city.ontime2 : "18:30", off: city ? city.offtime2 : "05:30" },
        c: { mode: "ASTRONOMICAL", on: city ? city.ontime3 : "19:00", off: city ? city.offtime3 : "05:00" }
      },
      dimming: 100,
      color_mode: "DEFAULT"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 6. Scheduling dashboard overview & metrics
exports.getScheduleOverview = async (req, res) => {
  try {
    const effectiveTime = timeService.getEffectiveTime();
    const effectiveDateStr = effectiveTime.dateFormatted;

    const allEvents = await EventSchedule.findAll({
      order: [["priority", "DESC"], ["startDate", "ASC"]]
    });

    const allDevices = await Device.findAll({
      attributes: ["id", "name", "cityId", "status", "switch1", "switch2", "switch3"]
    });

    let activeCount = 0;
    let upcomingCount = 0;
    let expiredCount = 0;
    const overriddenDeviceIds = new Set();

    allEvents.forEach(evt => {
      const status = getScheduleStatus(evt, effectiveDateStr);
      if (status === "ACTIVE") {
        activeCount++;
        try {
          const ids = JSON.parse(evt.deviceIds || "[]");
          if (Array.isArray(ids)) ids.forEach(id => overriddenDeviceIds.add(Number(id)));
          else if (evt.deviceIds === "*") allDevices.forEach(d => overriddenDeviceIds.add(d.id));
        } catch (e) {}
      } else if (status === "UPCOMING") {
        upcomingCount++;
      } else if (status === "EXPIRED") {
        expiredCount++;
      }
    });

    const totalDevices = allDevices.length;
    const holidayDevicesCount = overriddenDeviceIds.size;
    const cityDefaultDevicesCount = Math.max(0, totalDevices - holidayDevicesCount);

    res.json({
      effectiveDate: effectiveDateStr,
      effectiveTimeFormatted: effectiveTime.formatted,
      metrics: {
        totalSchedules: allEvents.length,
        activeEvents: activeCount,
        upcomingEvents: upcomingCount,
        expiredEvents: expiredCount,
        totalDevices,
        devicesOnEventSchedule: holidayDevicesCount,
        devicesOnCityDefault: cityDefaultDevicesCount
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
