 
 module.exports = app => {
  const city = require("../controllers/city.controller.js");
  const { authJwt } = require("../middlware");

  var router = require("express").Router();

  router.post("/", [authJwt.verifyToken,authJwt.isAdmin],city.create);
  router.get("/",[authJwt.verifyToken], city.findAll);
  router.get("/:id",[authJwt.verifyToken],  city.findOne);
  router.get("/:id/devices",[authJwt.verifyToken,authJwt.isAdmin], city.findOneWithDevice);
  router.get("/:id/users", [authJwt.verifyToken], city.findUsers);
  router.post("/adduser",[authJwt.verifyToken,authJwt.isAdmin], city.addUser);
  router.post("/deleteuser",[authJwt.verifyToken,authJwt.isAdmin], city.deleteUser);
  router.put("/:id",[authJwt.verifyToken,authJwt.isAdmin], city.update);
  router.delete("/:id",[authJwt.verifyToken,authJwt.isAdmin], city.delete); 

  app.use('/api/cities', router);
};
