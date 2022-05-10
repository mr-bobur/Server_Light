module.exports = {
  HOST: "http://185.196.214.199:3306",
  USER: "root",
  PASSWORD: "acdb2022",

  DB: "testdb",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
