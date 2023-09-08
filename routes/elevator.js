const elevatorController = require('../controllers/elevator');

module.exports = (app) => {
    app.post('/elevators', elevatorController.create);
    app.delete('/elevators/:elevator_id', elevatorController.destroy);
    app.get('/elevators', elevatorController.list);
    app.get('/elevators/:elevator_id', elevatorController.find);
    app.patch('/elevators/:elevator_id', elevatorController.update);
    app.put('/elevators/:elevator_id/doors', elevatorController.doors);
    app.put('/elevators/:elevator_id/users/:user_id', elevatorController.enter);
    app.delete('/elevators/:elevator_id/users/:user_id', elevatorController.exit)
}