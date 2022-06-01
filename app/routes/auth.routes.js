const { verifySignUp } = require("../middlware");
const controller = require("../controllers/auth.controller"); 
var router = require("express").Router();
const { authJwt } = require("../middlware");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.post("/signup",[verifySignUp.checkDuplicateUsernameOrEmail,verifySignUp.checkRolesExisted],controller.signup);
  router.post("/signin", controller.signin);
  router.post("/addcity", [authJwt.verifyToken, authJwt.isAdmin], controller.addCity);
  router.post("/delcity", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteCity);
  router.get("/users", [authJwt.verifyToken, authJwt.isAdmin], controller.findAll); 
  router.get("/users/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.findOne);
  router.put("/users/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.update);
  router.delete("/users/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.delete);
  app.use('/api/auth', router);

};