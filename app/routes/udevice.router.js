 
 module.exports = app => {
  const udevice = require("../controllers/udevice.controller.js");
  const { authJwt } = require("../middlware");

  var router = require("express").Router();

  router.post("/", [authJwt.verifyToken, authJwt.isAdmin],udevice.create);
  router.get("/",[authJwt.verifyToken, authJwt.isAdmin], udevice.findAll); 
  router.get("/:id",[authJwt.verifyToken,authJwt.isAdmin],  udevice.findOne); 
  router.put("/", udevice.update);
  router.delete("/:id",[authJwt.verifyToken,authJwt.isAdmin], udevice.delete); 

  app.use('/api/udevice', router);
};
