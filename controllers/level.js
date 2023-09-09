
const {isValidLevel} = require('../helpers/level');
const {isValidUser} = require('../helpers/user');

const db = require('../models/index');
const Level = db.Level;
const User = db.User;

module.exports = {
    // level must be between 1 and infinity
    find(req, res) {
        if (!isValidLevel(req.params.level_id)) {
            return res.status(400).send({
                error: `invalid level <${req.params.level_id}>`
            });
        }
        return Level
            .findWithUsers(req.params.level_id)
            .then(level => {
                if (!level) {
                    Level
                        .create({
                            id: req.params.level_id
                        })
                        .then(level => {
                            if (!level.users) {
                                level.users = [];
                            }
                            res.status(200).send(level)
                        })
                    return;
                }
                if (!level.users) {
                    level.users = [];
                }
                return res.status(200).send(level);
            }
            )
            .catch(error => res.status(400).send(error));
    },
    async call(req, res) {
        // req body is a user
        // req params is a level
        // create user and level if they don't exist
        // check if the user is already on the level
        if (!isValidLevel(req.params.level_id)) {
            return res.status(400).send({
                error: `invalid level <${req.params.level_id}>`
            });
        }
        else if (!isValidUser(req.body)) {
            return res.status(400).send({
                error: 'invalid user'
            });
        }
        const level = await Level.findWithUsers(req.params.level_id);
        if (!level) {
            await Level.create({
                id: req.params.level_id
            })
        }
        const user = await User.findByPk(req.body.id);
        if (user) {
            if (user.level_id === req.params.level_id) {
                if (!level.users) {
                    level.users = [];
                }
                return res.status(200).send(level);
            }
            else {
                await user.update({
                    level_id: req.params.level_id
                })
                const level = await Level.findWithUsers(req.params.level_id);
                if (!level.users) {
                    level.users = [];
                }
                return res.status(200).send(level);
            }
        }
        else {
            await User.create({
                id: req.body.id,
                weight: req.body.weight,
                destination: req.body.destination,
                level_id: req.params.level_id
            })
            if (!level.users) {
                level.users = [];
            }
            return res.status(200).send(level);
        }
    },
};

