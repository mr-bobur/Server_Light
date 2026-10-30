module.exports = (sequelize, Sequelize) => {
  const Notification = sequelize.define("notification", {
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    type: {
      type: Sequelize.STRING,
      defaultValue: "info" // info, warn, error, success
    },
    isRead: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    deviceId: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    cityId: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  });

  return Notification;
};
