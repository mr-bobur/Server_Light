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
    chipid:{
      type: Sequelize.BIGINT, 
    },
    meter_connected: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    meter_status: {
      type: Sequelize.STRING,
      defaultValue: 'CONNECTED'
    },
    voltage_a: {
      type: Sequelize.DOUBLE,
      defaultValue: 224.5
    },
    voltage_b: {
      type: Sequelize.DOUBLE,
      defaultValue: 226.0
    },
    voltage_c: {
      type: Sequelize.DOUBLE,
      defaultValue: 223.8
    },
    current_a: {
      type: Sequelize.DOUBLE,
      defaultValue: 12.4
    },
    current_b: {
      type: Sequelize.DOUBLE,
      defaultValue: 14.1
    },
    current_c: {
      type: Sequelize.DOUBLE,
      defaultValue: 11.8
    },
    active_power: {
      type: Sequelize.DOUBLE,
      defaultValue: 8.5
    },
    energy_kwh: {
      type: Sequelize.DOUBLE,
      defaultValue: 1240.5
    },
    power_factor: {
      type: Sequelize.DOUBLE,
      defaultValue: 0.96
    },
    frequency: {
      type: Sequelize.DOUBLE,
      defaultValue: 50.0
    },
    last_meter_read: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    rtc_time: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    rtc_synced_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  });
  return Device;
};