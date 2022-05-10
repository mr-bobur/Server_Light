module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "acdb2021",

  DB: "testdb",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
