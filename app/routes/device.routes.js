module.exports = app => {
  const deivices = require("../controllers/device.controller");
  var router = require("express").Router();
  router.post("/", deivices.create);
  router.get("/", deivices.findAll);
  router.get("/cities", deivices.findAllCities);
  router.get("/:id", deivices.findOne);
  router.get("/:id/city", deivices.findOneWithCity);
  router.put("/:id", deivices.update);
  router.delete("/:id", deivices.delete); 
  app.use('/api/devices', router);
};
