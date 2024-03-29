const db = require("../models");
const City = db.cities;
const Device = db.devices;
const Users = db.user;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Tutorial
  const city = {
    name: req.body.name,
    longitude: req.body.longitude,
    latitude: req.body.latitude
  };

  // Save city in the database
  City.create(city)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the City."
      });
    });
};

// Retrieve all city from the database.
exports.findAll = (req, res) => {

  console.log(req.headers);
  City.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};


// for just users
exports.findAll2 = (req, res) => {
  console.log(req.headers);
  const id = req.params.cityid;
  Users.findByPk(id)
    .then(data => {
      data.getCities().then(cities => {
        res.send(cities);
      })
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Citiessss with id=" + id
      });
    });
};


// Find a single City with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  var sdf = 0;
  City.findByPk(id,)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Tutorial with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Tutorial with id=" + id
      });
    });
};

// Find a single City with an id
exports.findOneWithDevice = (req, res) => {
  const id = req.params.id;
  var sdf = 0;
  City.findByPk(id, { include: ["devices"] })
    .then(data => {
      if (data) {
        res.send(data.devices);
      } else {
        res.status(404).send({
          message: `Cannot find City with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Tutorial with id=" + id
      });
    });
};


exports.findUsers = (req, res) => {
  const id = req.params.id;
  City.findByPk(id)
    .then(data => {
      data.getUsers().then(users => {
        res.send(users);
      })
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Citiessss with id=" + id
      });
    });
};



// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  console.log(req.params.id);
  City.update(req.body, {
    where: { id: id }
  })
    .then(num => {

      if (num == 1) {
        Device.findAll()
          .then(data => {
            data.forEach(device => {
              Device.update({ switch4: false }, { where: { id: device.id } });
            });
          });

        res.send({
          message: "City was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update City with id=${id}. Maybe Tutorial was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating City with id=" + id
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  City.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Tutorial was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id
      });
    });
};

