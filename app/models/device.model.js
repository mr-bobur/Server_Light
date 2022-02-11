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
    blocking: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
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
    rasp1: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    rasp2: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    ras3: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    aontime1: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    aofftime1: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    aontime2: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    aofftime2: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    aontime3: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    aofftime3: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
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
    },
    switch4: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    iswitch1: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    iswitch2: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    iswitch3: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    meassure:{
      type: Sequelize.STRING(5000),
      defaultValue: null
    },
    sim:{
      type: Sequelize.STRING,
      defaultValue: '+998901234567'
    },
    temp:{
      type: Sequelize.INTEGER,
      defaultValue: 22
    },
    ctemp:{
      type: Sequelize.INTEGER,
      defaultValue: 80
    },
    uid:{
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1
    }
  });
  return Device;
};
