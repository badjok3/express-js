const controllers = require('../controllers');
const restrictedPages = require('./auth');

module.exports = app => {
    app.get('/', controllers.home.index);
    app.get('/about', restrictedPages.hasRole('Admin'), controllers.home.about);
    app.get('/register', controllers.user.registerGet);
    app.post('/register', controllers.user.registerPost);
    app.post('/logout', controllers.user.logout);
    app.get('/login', controllers.user.loginGet);
    app.post('/login', controllers.user.loginPost);

    app.get('/myOrders', restrictedPages.isAuthed, controllers.order.userOrdersGet);

    app.get('/orders', restrictedPages.isAuthed, controllers.order.allOrdersGet);

    app.get('/productCreate', controllers.order.productCreateGet);
    app.post('/productCreate', controllers.order.productCreatePost);

    app.get('/placeOrder/:id', restrictedPages.isAuthed, controllers.order.placeOrderGet);
    app.post('/placeOrder/:id', controllers.order.placeOrderPost);

    app.get('/order/details/:id', restrictedPages.isAuthed, controllers.order.orderDetailsGet);

    app.post('/order/edit/:id', controllers.order.editOrder);

    app.get('/order/delete/:id', controllers.order.deleteOrder);

    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};