const db = require("../models");
const Udevice = db.udevice;
const Device = db.devices;
const Op = db.Sequelize.Op;

// Create and Save a new U_Device
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Save city in the database
  Udevice.create(req.body)
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

  Udevice.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving U_Devices."
      });
    });
}; 
// Find a single City with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Udevice.findByPk(id,)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find U_Device with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving U_Device with id=" + id
      });
    });
};

// Update a U_Device by the id in the request
exports.update = (req, res) => {
  if (req.body) {
    Device.find({
      where: {
        chipid: req.body.chipid,
      }
    }).then(device => { 
          if (req.body.cityid) {
            Device.update(req.body, {
              where: { cityid: req.body.cityid }
            }).then(() => {
              res.send(device);
            }).catch(err => {
              res.status(500).send({
                message: "Error updating Devie with id=" + id + err
              });
            });
          } else {
            res.status(401).send({
              message: "Unauthorized request"
            });
          }
      }).catch(err => {
        res.status(500).send({
          message: "Error updating Devie with id=" + id
        });
      });

  } else {
    res.status(500).send({
      message: "Error updating Devie with id=" + id
    });
  }

};

// Delete a U_Device with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Udevice.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "U_Device was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete U_Device with id=${id}. Maybe U_Device was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete U_Device with id=" + id
      });
    });
};

