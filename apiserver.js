const express = require("express");
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");


var app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

 const apiWeahter = require("./app/api_weather");

console.log(apiWeahter);

// db.sequelize.sync(); 
// drop the table if it already exists

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
  initial();
});

app.get("/", (req, res) => {
  res.json({ message: "City lightning API service working" });
});

// require("./app/routes/turorial.routes")(app);
require("./app/routes/city.routes")(app);
require("./app/routes/device.routes")(app);

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/access.routes')(app);

const PORT = process.env.PORT || 8089;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);

});  



 




function initial() {
  Role.create({
    id: 1,
    name: "user"
  });

  Role.create({
    id: 2,
    name: "moderator"
  });

  Role.create({
    id: 3,
    name: "admin"
  });
}