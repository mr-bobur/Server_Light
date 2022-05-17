 
 module.exports = app => {
  const city = require("../controllers/city.controller.js");
  const { authJwt } = require("../middlware");

  var router = require("express").Router();

  router.post("/", city.create);
  router.get("/", city.findAll);
  router.get("/:id", city.findOne);
  router.get("/:id/devices", city.findOneWithDevice);
  router.get("/:id/users", city.findUsers);
  router.post("/adduser", city.addUser);
  router.post("/deleteuser", city.deleteUser);
  router.put("/:id", city.update);
  router.delete("/:id", city.delete); 

  app.use('/api/cities', router);
};
