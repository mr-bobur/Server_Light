module.exports = {
  HOST: "localhost",
  USER: "root1",
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
