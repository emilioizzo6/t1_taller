const levelController = require('../controllers/level');

module.exports = (app) => {
    app.get('/levels/:level_id', levelController.find);
    app.post('/levels/:level_id/users', levelController.call);
}