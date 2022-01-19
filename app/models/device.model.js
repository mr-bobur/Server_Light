module.exports = (sequelize, Sequelize) => {
  const Device = sequelize.define("device", {
    
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    longitude: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    latitude: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    ontime1: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    offtime1: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    ontime2: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    offtime2: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    ontime3: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    offtime3: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    automatic1: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    automatic2: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    switch1: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    switch2: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    switch3: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  });
  return Device;
};
