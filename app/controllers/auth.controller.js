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
    User.findOne({
        where: {
            username: req.body.username
        }
    })
        .then(user => {
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
                res.status(200).send({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    roles: authorities,
                    accessToken: token
                });
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.findCities = (req, res) => {
    User.findOne({ where: { username: req.body.username } })
        .then(data => {
            data.getCities({ attributes: ['name'] }).then(cities => {
                res.send(cities);
            })
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Citiessss with id=" + id
            });
        });
};


// CRUD

exports.findAll = (req, res) => {
    User.findAll({
        include: [
            {
                model: City,
                through: {
                    attributes: ['id', 'name']
                },
                as: 'cities'
            },
            {
                model: Role,
                through: {
                    attributes: ['id', 'name']
                },
                as: 'roles'
            }
        ]
    })
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
    User.findByPk(id,)
        .then(data => {
            if (data) {
                var authorities = [];
                var cities = [];
                data.getRoles().then(roles => {
                    for (let i = 0; i < roles.length; i++) {
                        authorities.push(roles[i].name);
                    }

                    data.getCities().then(cities1 => {
                        if (cities1) {
                            for (let i = 0; i < cities1.length; i++) {
                                cities.push(cities1[i].name);
                            }
                            res.status(200).send({
                                id: data.id,
                                username: data.username,
                                email: data.email,
                                roles: authorities,
                                cities: cities,
                            });
                        } else {
                            res.status(200).send({
                                id: data.id,
                                username: data.username,
                                email: data.email,
                                roles: authorities
                            });
                        }

                    });



                });
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


// Update a Tutorial by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    req.body.password = bcrypt.hashSync(req.body.password, 8)
    User.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Users was updated successfully."
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
    User.findByPk(req.body.userId) //.setCities(req.body.user)
        .then(
            user1 => {
                if (req.body.cityId) {
                    City.findByPk(req.body.cityId) //.setCities(req.body.user)
                        .then(
                            city1 => {
                                user1.addCities(city1);
                                res.send(user1);
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

