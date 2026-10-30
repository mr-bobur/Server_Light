module.exports = (sequelize, Sequelize) => {
  const SystemTime = sequelize.define("system_time", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    mode: {
      type: Sequelize.STRING,
      defaultValue: "AUTO" // "AUTO" or "MANUAL"
    },
    offset_seconds: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    manual_datetime: {
      type: Sequelize.DATE,
      allowNull: true
    },
    manual_set_at: {
      type: Sequelize.DATE,
      allowNull: true
    },
    sync_interval_seconds: {
      type: Sequelize.INTEGER,
      defaultValue: 3600
    },
    timezone: {
      type: Sequelize.STRING,
      defaultValue: "Asia/Tashkent"
    },
    updated_by: {
      type: Sequelize.STRING,
      defaultValue: "system"
    }
  });

  return SystemTime;
};
