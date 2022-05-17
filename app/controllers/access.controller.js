const db = require("../models");
const City = db.cities;
const User = db.user;
const Op = db.Sequelize.Op;


exports.addUser = (req, res) => { 
  const id = req.body.user;
  //var user = User.findByPk(id)
  User.findByPk(req.body.user) //.setCities(req.body.user)
    .then(user1 => {
      res.send(
        user1.addCities(req.body.city)
      );
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating City with id=" + id
      });
    });
};
