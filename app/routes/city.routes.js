 
 module.exports = app => {
  const city = require("../controllers/city.controller.js");
  const { authJwt } = require("../middlware");

  var router = require("express").Router();

  router.post("/", [authJwt.verifyToken, authJwt.isAdmin],city.create);
  router.get("/",[authJwt.verifyToken, authJwt.isAdmin], city.findAll);
  router.get("/",[authJwt.verifyToken,authJwt.isModerator], city.findAll2);
  router.get("/:id",[authJwt.verifyToken],  city.findOne);
  router.get("/:id/devices",[authJwt.verifyToken], city.findOneWithDevice);
  router.get("/:id/users", [authJwt.verifyToken], city.findUsers); 
  router.put("/:id",[authJwt.verifyToken,authJwt.isAdmin], city.update);
  router.delete("/:id",[authJwt.verifyToken,authJwt.isAdmin], city.delete); 

  app.use('/api/cities', router);
};
