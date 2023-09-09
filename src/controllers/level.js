
const {isValidLevel} = require('../helpers/level');
const {isValidUser} = require('../helpers/user');

const db = require('../models/index');
const Level = db.Level;
const User = db.User;

module.exports = {
    // level must be between 1 and infinity
    async find(req, res) {
        if (!isValidLevel(req.params.level_id)) {
            return res.status(400).send({
                error: `invalid level <${req.params.level_id}>`
            });
        }
        const level = await Level.findWithUsers(req.params.level_id);
        if (!level) {
            const level = await Level.create({
                id: req.params.level_id
            })
            if (!level.dataValues?.users) {
                level.dataValues.users = [];
            }
            res.status(200).send(level)
                return;
        }
        const levelData = level.dataValues;
        if (!levelData.users) {
            levelData.users = [];
        }
        return res.status(200).send(level);
    },

    async call(req, res) {
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
                if (!level.dataValues.users) {
                    level.dataValues.users = [];
                }
                return res.status(200).send(level);
            }
            else {
                await user.update({
                    level_id: req.params.level_id
                })
                const level = await Level.findWithUsers(req.params.level_id);
                if (!level.dataValues.users) {
                    level.dataValues.users = [];
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
            if (!level.dataValues.users) {
                level.dataValues.users = [];
            }
            return res.status(200).send(level);
        }
    },
};

