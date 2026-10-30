module.exports = (sequelize, Sequelize) => {
  const CityHistory = sequelize.define("city_history", {
    cityId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    action: {
      type: Sequelize.STRING,
      allowNull: false
    },
    automatic: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    details: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    changedBy: {
      type: Sequelize.STRING,
      defaultValue: "Administrator"
    }
  });

  return CityHistory;
};
