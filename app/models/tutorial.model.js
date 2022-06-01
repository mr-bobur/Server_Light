module.exports = (sequelize, Sequelize) => {
  const Tutorial = sequelize.define("tutorial", {
    userid:{
      type: Sequelize.BIGINT, 
    },
    cityid:{
      type: Sequelize.BIGINT, 
    },
    deviceid:{
      type: Sequelize.BIGINT, 
    },
    title: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING(5000)
    },
    watched: {
      type: Sequelize.BOOLEAN
    }
  });

  return Tutorial;
  
};
