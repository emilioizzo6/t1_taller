const resetController = require('../controllers/reset');

module.exports = (app) => {
    app.post('/reset', resetController.reset);
}
