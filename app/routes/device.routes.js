module.exports = app => {
  const deivices = require("../controllers/device.controller");
  const history = require("../controllers/device_history.controller");
  const { authJwt } = require("../middlware");
  var router = require("express").Router();

  router.post("/", [authJwt.verifyToken], deivices.create);
  router.get("/", [authJwt.verifyToken], deivices.findAll);
  router.get("/:id", [authJwt.verifyToken], deivices.findOne);
  router.get("/:id/city", [authJwt.verifyToken], deivices.findOneWithCity);
  
  // Smart meter endpoints
  router.get("/:id/meter/check", [authJwt.verifyToken], deivices.checkMeter);
  router.post("/:id/meter/read", [authJwt.verifyToken], deivices.readMeter);

  // Device RTC endpoints
  router.post("/:id/rtc/sync", [authJwt.verifyToken], deivices.syncRtc);
  router.post("/:id/rtc/set", [authJwt.verifyToken], deivices.setRtc);

  // Device weekly schedules endpoints
  router.get("/:id/schedules", [authJwt.verifyToken], deivices.getSchedules);
  router.put("/:id/schedules/:scheduleId", [authJwt.verifyToken], deivices.updateSchedule);

  // Device history endpoint
  router.get("/:deviceId/history", [authJwt.verifyToken], history.findByDevice);
  router.post("/:deviceId/history", [authJwt.verifyToken], history.create);

  router.put("/bytoken", deivices.updateFormDevice);
  router.put("/dev", deivices.updateFormDevice2);
  router.put("/:id", [authJwt.verifyToken], deivices.update);
  router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], deivices.delete);

  app.use('/api/devices', router);
};
