const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

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



db.cities.hasMany(db.devices, { as: "devices" });

db.devices.belongsTo(db.cities, {
  foreignKey: "cityId",
  as: "city",
  allowNull: false
});

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
  foreignKey: "userId",
  otherKey: "cityId"
});

db.user.belongsToMany(db.cities, {
  through: "user_city",
  foreignKey: "cityId",
  otherKey: "userId"
});



module.exports = db;
