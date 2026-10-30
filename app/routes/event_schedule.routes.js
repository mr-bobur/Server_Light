const controller = require("../controllers/event_schedule.controller");
const { authJwt } = require("../middlware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Overview metrics
  app.get("/api/schedules/overview", controller.getScheduleOverview);

  // List all event schedules
  app.get("/api/schedules/events", controller.getAllEvents);

  // Create event schedule (protected)
  app.post("/api/schedules/events", [authJwt.verifyToken], controller.createEvent);

  // Update event schedule (protected)
  app.put("/api/schedules/events/:id", [authJwt.verifyToken], controller.updateEvent);

  // Delete event schedule (protected)
  app.delete("/api/schedules/events/:id", [authJwt.verifyToken], controller.deleteEvent);

  // Get effective schedule for a device
  app.get("/api/schedules/device/:id/effective", controller.getEffectiveDeviceSchedule);
};
