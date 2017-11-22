const controllers = require('../controllers');
const restrictedPages = require('./auth');
const hotelController = require('../controllers/hotel-controller');

module.exports = app => {
    app.get('/', controllers.home.index);
    app.get('/about', restrictedPages.hasRole('Admin'), controllers.home.about);
    app.get('/register', controllers.user.registerGet);
    app.post('/register', controllers.user.registerPost);
    app.post('/logout', controllers.user.logout);
    app.get('/login', controllers.user.loginGet);
    app.post('/login', controllers.user.loginPost);

    app.get('/addHotel', restrictedPages.isAuthed, hotelController.addHotelGet);
    app.post('/addHotel', hotelController.addHotelPost);

    app.get('/list', hotelController.allHotelsGet);

    app.get('/details', hotelController.detailsGet);

    app.get('/like/:id',restrictedPages.isAuthed, hotelController.likeHotel);

    app.post('/comment/:id', restrictedPages.isAuthed, hotelController.commentCreate);

    app.get('/user/details/:id', restrictedPages.isAuthed, controllers.user.userDetailsGet);

    app.get('/hotel/edit/:id', restrictedPages.hasRole('Admin'), hotelController.editHotelGet);
    app.post('/hotel/edit/:id', restrictedPages.hasRole('Admin'), hotelController.editHotelPost);

    app.get('/comment/edit/:id', restrictedPages.hasRole('Admin'), hotelController.editCommentGet);
    app.post('/comment/edit/:id', restrictedPages.hasRole('Admin'), hotelController.editCommentPost);

    app.get('/hotel/delete/:id', restrictedPages.hasRole('Admin'), hotelController.deleteHotel);

    app.get('/comment/delete/:id', restrictedPages.hasRole('Admin'), hotelController.deleteComment);

    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};