module.exports = app => {
  const notifications = require("../controllers/notification.controller");
  const { authJwt } = require("../middlware");
  var router = require("express").Router();

  router.get("/", [authJwt.verifyToken], notifications.findAll);
  router.put("/read-all", [authJwt.verifyToken], notifications.markAllAsRead);
  router.put("/:id/read", [authJwt.verifyToken], notifications.markAsRead);
  router.post("/", [authJwt.verifyToken], notifications.create);
  router.delete("/:id", [authJwt.verifyToken], notifications.delete);

  app.use('/api/notifications', router);
};
