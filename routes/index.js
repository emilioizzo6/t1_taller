const resetRouter = require('./reset');
const levelRouter = require('./level');
const elevatorRouter = require('./elevator');
// const userRouter = require('./user');

module.exports = (app) => {
    resetRouter(app);
    levelRouter(app);
    elevatorRouter(app);
    // userRouter(app);
}