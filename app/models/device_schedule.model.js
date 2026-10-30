module.exports = (sequelize, Sequelize) => {
  const DeviceSchedule = sequelize.define("device_schedule", {
    deviceId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    day_of_week: {
      type: Sequelize.INTEGER, // 0 = Yakshanba, 1 = Dushanba, ..., 6 = Shanba
      allowNull: false
    },
    day_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    line_a_on: {
      type: Sequelize.STRING,
      defaultValue: "18:00"
    },
    line_a_off: {
      type: Sequelize.STRING,
      defaultValue: "06:00"
    },
    line_b_on: {
      type: Sequelize.STRING,
      defaultValue: "18:30"
    },
    line_b_off: {
      type: Sequelize.STRING,
      defaultValue: "05:30"
    },
    line_c_on: {
      type: Sequelize.STRING,
      defaultValue: "19:00"
    },
    line_c_off: {
      type: Sequelize.STRING,
      defaultValue: "05:00"
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    }
  });

  return DeviceSchedule;
};
