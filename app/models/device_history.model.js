module.exports = (sequelize, Sequelize) => {
  const DeviceHistory = sequelize.define("device_history", {
    deviceId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    eventType: {
      type: Sequelize.STRING,
      defaultValue: "METER_READ" // STATUS_CHANGE, RELAY_TOGGLE, METER_READ, ALERT
    },
    voltage_a: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    voltage_b: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    voltage_c: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    current_a: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    current_b: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    current_c: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    active_power: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    energy_kwh: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    power_factor: {
      type: Sequelize.DOUBLE,
      defaultValue: 0.95
    },
    frequency: {
      type: Sequelize.DOUBLE,
      defaultValue: 50.0
    },
    status: {
      type: Sequelize.BOOLEAN,
      allowNull: true
    },
    switch1: {
      type: Sequelize.BOOLEAN,
      allowNull: true
    },
    switch2: {
      type: Sequelize.BOOLEAN,
      allowNull: true
    },
    switch3: {
      type: Sequelize.BOOLEAN,
      allowNull: true
    },
    details: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  });

  return DeviceHistory;
};
