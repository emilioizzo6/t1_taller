const User = require('../models').User;

module.exports = {
    create(req, res) {
        return User.create({
            id: req.body.id,
            weight: req.body.weight,
            destination: req.body.destination,
        })
            .then((user) => res.status(201).send(user))
            .catch((error) => res.status(400).send(error));
    },
};