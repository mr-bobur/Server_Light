 
 module.exports = app => {
  const accessor = require("../controllers/access.controller.js");
  const { authJwt } = require("../middlware");

  var router = require("express").Router();

  router.post("/", accessor.addUser);

  app.use('/api/access', router);
};
