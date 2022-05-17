module.exports = app => {
  const deivices = require("../controllers/device.controller");
  const { authJwt } = require("../middlware");
  var router = require("express").Router();
  router.post("/", [authJwt.verifyToken, authJwt.isAdmin], deivices.create);
  router.get("/", [authJwt.verifyToken], deivices.findAll);
  router.get("/:id", [authJwt.verifyToken], deivices.findOne);
  router.get("/:id/city", [authJwt.verifyToken], deivices.findOneWithCity);
  router.put("/:id", [authJwt.verifyToken], deivices.update);
  router.put("/:id/bytoken", deivices.updateFormDevice);
  router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], deivices.delete);
  app.use('/api/devices', router);
};
