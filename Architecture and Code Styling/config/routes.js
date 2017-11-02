const controllers = require('../controllers');
const restrictedPages = require('./auth');
const carController = require('../controllers/car-controller');

module.exports = app => {
    app.get('/', controllers.home.index);
    app.get('/about', restrictedPages.hasRole('Admin'), controllers.home.about);
    app.get('/register', controllers.user.registerGet);
    app.post('/register', controllers.user.registerPost);
    app.post('/logout', controllers.user.logout);
    app.get('/login', controllers.user.loginGet);
    app.post('/login', controllers.user.loginPost);

    app.get('/createCar', carController.createCarGet);
    app.post('/createCar', carController.createCarPost);

    app.get('/cars', carController.allCarsGet);

    app.get('/cars/rent/:id', carController.rentCarGet);
    app.post('/cars/rent/:id', carController.rentCarPost);

    app.get('/cars/edit/:id', carController.editCarGet);
    app.post('/cars/edit/:id', carController.editCarPost);

    app.get('/cars/:id', carController.myCarsGet);

    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};