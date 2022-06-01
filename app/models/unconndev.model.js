module.exports = (sequelize, Sequelize) => {
  const Udevice = sequelize.define("udevice", {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
      unique: true
    },
    chipid:{
      type: Sequelize.BIGINT, 
    }, 
  });
  return Udevice;
};

//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