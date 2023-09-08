const User = require('../models').User;
const Level = require('../models').Level;
const Elevator = require('../models').Elevator;

module.exports = {
    async reset(req, res) {
        try {
            await User.destroy({
                where: {},
            });
            await Level.destroy({
                where: {},
            });
            await Elevator.destroy({
                where: {},
            });
            return res.status(200).send({
                message: 'Ok'
            });
        } catch (error) {
            return res.status(400).send({
                error: error.message
            });
        }
    }
};