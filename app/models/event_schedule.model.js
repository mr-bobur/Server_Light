module.exports = (sequelize, Sequelize) => {
  const EventSchedule = sequelize.define("event_schedule", {
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    type: {
      type: Sequelize.STRING,
      defaultValue: "HOLIDAY" // HOLIDAY, EVENT, SEASONAL, MAINTENANCE, SPECIAL
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    startDate: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    endDate: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    priority: {
      type: Sequelize.INTEGER,
      defaultValue: 10 // Higher priority overrides lower priority
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    cityId: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    deviceIds: {
      type: Sequelize.TEXT, // JSON array: "[1,2,5]" or "*"
      defaultValue: "[]"
    },
    line_a_mode: {
      type: Sequelize.STRING,
      defaultValue: "SCHEDULE" // SCHEDULE, ALWAYS_ON, ASTRONOMICAL, OFF
    },
    line_a_on: {
      type: Sequelize.STRING,
      defaultValue: "18:00"
    },
    line_a_off: {
      type: Sequelize.STRING,
      defaultValue: "06:00"
    },
    line_b_mode: {
      type: Sequelize.STRING,
      defaultValue: "SCHEDULE"
    },
    line_b_on: {
      type: Sequelize.STRING,
      defaultValue: "18:30"
    },
    line_b_off: {
      type: Sequelize.STRING,
      defaultValue: "03:00"
    },
    line_c_mode: {
      type: Sequelize.STRING,
      defaultValue: "SCHEDULE"
    },
    line_c_on: {
      type: Sequelize.STRING,
      defaultValue: "19:00"
    },
    line_c_off: {
      type: Sequelize.STRING,
      defaultValue: "02:00"
    },
    dimming: {
      type: Sequelize.INTEGER,
      defaultValue: 100
    },
    color_mode: {
      type: Sequelize.STRING,
      defaultValue: "DEFAULT"
    },
    created_by: {
      type: Sequelize.STRING,
      defaultValue: "admin"
    }
  });

  return EventSchedule;
};
