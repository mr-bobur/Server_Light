module.exports = app => {
  const system = require("../controllers/system.controller.js");
  const { authJwt } = require("../middlware");
  var router = require("express").Router();

  // Public/all-users can get current system time
  router.get("/time", system.getTime);
  
  // Setting time requires authenticated token
  router.post("/time", [authJwt.verifyToken], system.setTime);
  router.post("/time/reset", [authJwt.verifyToken], system.resetTime);

  app.use('/api/system', router);
};
