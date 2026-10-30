const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  logging: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

var db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.tutorials = require("./tutorial.model.js")(sequelize, Sequelize);
db.cities    = require("./city.model.js")(sequelize, Sequelize);
db.devices   = require("./device.model.js")(sequelize, Sequelize);
db.user      = require("./user.model.js")(sequelize, Sequelize);
db.role      = require("./role.model.js")(sequelize, Sequelize);
db.udevice   = require("./unconndev.model.js")(sequelize, Sequelize);
db.notifications = require("./notification.model.js")(sequelize, Sequelize);
db.device_history = require("./device_history.model.js")(sequelize, Sequelize);
db.city_history = require("./city_history.model.js")(sequelize, Sequelize);
db.device_schedules = require("./device_schedule.model.js")(sequelize, Sequelize);
db.system_time = require("./system_time.model.js")(sequelize, Sequelize);
db.event_schedules = require("./event_schedule.model.js")(sequelize, Sequelize);

db.cities.hasMany(db.devices, { as: "devices" });

db.devices.belongsTo(db.cities, {
  foreignKey: "cityId",
  as: "city",
  allowNull: false
});

db.devices.hasMany(db.device_history, { as: "history", foreignKey: "deviceId" });
db.device_history.belongsTo(db.devices, { as: "device", foreignKey: "deviceId" });

db.devices.hasMany(db.notifications, { as: "notifications", foreignKey: "deviceId" });
db.notifications.belongsTo(db.devices, { as: "device", foreignKey: "deviceId" });

db.cities.hasMany(db.city_history, { as: "history", foreignKey: "cityId" });
db.city_history.belongsTo(db.cities, { as: "city", foreignKey: "cityId" });

db.devices.hasMany(db.device_schedules, { as: "schedules", foreignKey: "deviceId" });
db.device_schedules.belongsTo(db.devices, { as: "device", foreignKey: "deviceId" });

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

db.ROLES = ["user", "admin", "moderator"];

db.cities.belongsToMany(db.user, {
  through: "user_city",
  foreignKey: "cityId",
  otherKey: "userId"
});

db.user.belongsToMany(db.cities, {
  through: "user_city",
  foreignKey: "userId",
  otherKey: "cityId"
});

module.exports = db;
