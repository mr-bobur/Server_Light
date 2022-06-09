const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const City = db.cities;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    // Save User to Database
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    }).then(user => {
        if (req.body.roles) {
            Role.findAll({
                where: {
                    name: {
                        [Op.or]: req.body.roles
                    }
                }
            }).then(roles => {
                user.setRoles(roles)
                    .then(() => {
                        res.send({ message: "User was registered successfully!" });
                    });
            });
        } else {
            // user role = 1
            user.setRoles([1]).then(() => {
                res.send({ message: "User was registered successfully!" });
            });
        }
    })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.signin = (req, res) => {
    User.findOne( { include: { all: true } },{
        where: {
            username: req.body.username
        }, 
    }).then(user => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,  
                    message: "Invalid Password!"
                });
            }

            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 60000 // 24 hours
            });

            var authorities = [];
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push("ROLE_" + roles[i].name.toUpperCase());
                }
                // console.log(user);

                res.status(200).send({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    roles: authorities,
                    accessToken: token, 
                    cities: user.cities
                });
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}; 


// CRUD

exports.findAll = (req, res) => {
    User.findAll({ include: { all: true } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Users."
            });
        });
};

// Find a single City with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    User.findByPk(id, { include: { all: true } })
        .then(data => {
            if (data) {
                res.status(200).send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find User with id=${id}.`
                });
            }
        })
        .catch(() => {
            res.status(500).send({
                message: "Error retrieving User with id=" + id
            });
        });
};


// Update a Users by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    var user = req.body;
    if (user.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
    }

    User.update(user, {
        where: { id: id }
    }).then(num => {
        if (num == 1) {
            User.findByPk(id).then(
                user11 => {
                    if (req.body.roles.length > 0) {
                        Role.findAll({
                            where: {
                                name: {
                                    [Op.or]: req.body.roles
                                }
                            }
                        }).then(roles => {
                            user11.setRoles(roles)
                                .then(() => {
                                    res.send({ message: "User was registered successfully!" });
                                });
                        });
                    } else {
                        user11.setRoles([])
                            .then(() => {
                                res.send({ message: "User was registered successfully!" });
                            });
                    }
                });
        } else {
            res.send({
                message: `Cannot update users with id=${id}`
            });
        }
    })
        .catch(() => {
            res.status(500).send({
                message: "Error updating Users with id=" + id
            });
        });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    User.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Tutorial with id=${id}. Maybe User was not found!`
                });
            }
        })
        .catch(() => {
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
};


exports.addCity = (req, res) => {
    User.findByPk(req.body.id) //.setCities(req.body.user)
        .then(
            user1 => {
                if (req.body.cities) {
                    City.findAll(
                        {
                            where: {
                                id: req.body.cities
                            }
                        }
                    ).then(
                        city1 => {
                            user1.setCities(city1);
                            res.send({ user1: "salom" });
                        });
                }
            })
        .catch(err => {
            res.status(500).send({
                message: "Error updating City with id="
            });
        });
};



exports.deleteCity = (req, res) => {
    User.findByPk(req.body.userId) //.setCities(req.body.user)
        .then(user1 => {
            City.findByPk(req.body.cityId) //.setCities(req.body.user)
                .then(
                    city1 => {
                        user1.removeCities(city1);
                        res.send({ msg: "deleted" });
                    });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating City with id="
            });
        });
};




exports.findCities = (req, res) => {
    const id = req.params.id;
    User.findByPk(id)
        .then(data => {
            data.getCities().then(cities => {
                res.send(cities);
            })
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Cities with id=" + id
            });
        });
};

