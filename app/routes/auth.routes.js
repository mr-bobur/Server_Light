const { verifySignUp } = require("../middlware");
const controller = require("../controllers/auth.controller");

const { authJwt } = require("../middlware");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/addcity", [authJwt.verifyToken, authJwt.isAdmin], controller.addCity);
  app.post("/api/auth/delcity", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteCity);
  app.get("/api/auth/users", [authJwt.verifyToken, authJwt.isAdmin], controller.findAll);
  app.get("/api/auth/users/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.findOne);
  app.put("/api/auth/users/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.update);
  app.delete("/api/auth/users/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.delete);

  app.post("/api/auth/signin/cities", controller.findCities);
};