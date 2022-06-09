const db = require("../models");
const Device = db.devices;

// Create and Save a new Tutorial
exports.create = (req, res) => {

  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  Device.create(req.body)
    .then(data => {

      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Device."
      });
    });
};
exports.findAll = (req, res) => {
  Device.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Device."
      });
    });
};

exports.findAllCities = (req, res) => {
  Device.findAll({ include: ["city"] })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Device."
      });
    });
};

// Find a single Device with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Device.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Device with id=${id}.`

        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Device with id=" + id
      });
    });
};


exports.findOneWithCity = (req, res) => {
  const id = req.params.id;
  Device.findByPk(id, { include: " " })
    .then(data => {
      if (data) {
        res.send(data.city);
      } else {
        res.status(404).send({
          message: `Cannot find Device with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Device with id=" + id
      });
    });
};


// Update a Device by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  var dev;
  Device.findByPk(id)
    .then(data => { dev = data });

  Device.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {

        res.send(dev);
      } else {
        res.send({
          message: `Cannot update Device with id=${id}. Maybe Device was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Devie with id=" + id
      });
    });
  };
  
  // Update a Device by the id in the request
  exports.updateFormDevice = (req, res) => {
  console.log({chipid: req.body.chipid});
  Device.findOne({ where: { chipid: req.body.chipid } })
    .then(device => { 
      if (device) {
        Device.update(req.body, {
          where: { chipid: req.body.chipid }
        }).then(() => {
          Device.findOne({ where: { chipid: req.body.chipid } })
            .then(device => {
              res.send(device);
            });
        }).catch(() => {
          res.status(500).send({
            message: "Error updating Device"});
        });
      } else {
        const dev2 = null;
        const chipId2 = req.body.chipid;
        dev2.name = chipId2.toString();
        dev2.chipid = req.body.chipid;
        dev2.longitude = 45;
        dev2.latitude = 65;
        Device.create(dev2).then(() => {
          Device.findOne({ where: { chipid: req.body.chipid } })
            .then(device => {
              res.send(device);
            });
        }).catch(() => {
          res.status(500).send({ message: "Error creating Device"});
        });
      }
      // console.log("updated by device");
      
    }).catch(() => {
      const chipId2 = req.body.chipid;
      const dev2 = { name:req.body.chipid,chipid: req.body.chipid, longitude:45, latitude: 65}
        Device.create(dev2).then(() => {
          Device.findOne({ where: { chipid: req.body.chipid } })
            .then(device => {
              res.send(device);
            });
        }).catch(() => {
          res.status(500).send({ message: "Error creating Device"});
        }); 
    });
};


// Delete a Device with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Device.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Device was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Device with id=${id}. Maybe Device was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Device with id=" + id
      });
    });
};
