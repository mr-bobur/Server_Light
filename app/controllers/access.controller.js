const db = require("../models");
const City = db.cities;
const User = db.user;
const Op = db.Sequelize.Op;

// Update a Tutorial by the id in the request
exports.addUser = (req, res) => {

  const id = req.body.user;
  //var user = User.findByPk(id)
  User.findByPk(req.body.user) //.setCities(req.body.user)
    .then(city1 => {
      res.send(
        city1.addCities(req.body.city)
      );
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating City with id=" + id
      });
    });
};
