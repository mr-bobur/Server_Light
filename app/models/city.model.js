module.exports = (sequelize, Sequelize) => {
  const City = sequelize.define("city", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: { args: true, msg: 'Shahar nomi oldin ishlatilgan' }
    },
    longitude: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    latitude: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    sunrise: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    sunset: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    
    ontime: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    offtime: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
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
    ontimefix: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    offtimefix: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    visiblity: {
      type: Sequelize.INTEGER, 
      defaultValue: 1000
    },
    automatic: {
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
  return City;
};
