const User = require('mongoose').model('User');
const Product = require('../models/Product');
const Order = require('../models/Order');

function renderHome(res, globalErr) {
    Product.find({}).then((allProducts) => {
        let chickenProducts = [];
        let beefProducts = [];
        let lambProducts = [];

        for (let product of allProducts) {

            if (product.category === 'chicken') {
                chickenProducts.push(product);
            } else if (product.category === 'beef') {
                beefProducts.push(product);
            } else {
                lambProducts.push(product);
            }
        }

        res.render('home/index', {
            chicken: chickenProducts, beef: beefProducts, lamb: lambProducts,
            globalError: globalErr
        });
    })
}

module.exports = {
    userOrdersGet: (req, res) => {
        let userId = req.user._id;
        Order.find({creator: userId}).populate('product').then((userOrders) => {
            res.render('orders/list', {orders: userOrders});
        })
    },
    allOrdersGet: (req, res) => {
        let userId = req.user._id;

        User.findById(userId).then((currentUser) => {
            if (currentUser.roles[0] === 'Admin') {
                currentUser.isAdmin = true;
                currentUser.save()
                    .then(() => {
                        Order.find({}).populate('product').then((allOrders) => {
                            for (let order of allOrders) {
                                Order.findById(order._id).then((currentOrder) => {
                                    if (currentOrder.status === 'Pending') {
                                        currentOrder.pending = true;
                                        currentOrder.inProgress = false;
                                        currentOrder.inTransit = false;
                                        currentOrder.delivered = false;
                                    } else if (currentOrder.status === 'In Progress') {
                                        currentOrder.pending = false;
                                        currentOrder.inProgress = true;
                                        currentOrder.inTransit = false;
                                        currentOrder.delivered = false;
                                    } else if (currentOrder.status === 'In Transit') {
                                        currentOrder.pending = false;
                                        currentOrder.inProgress = false;
                                        currentOrder.inTransit = true;
                                        currentOrder.delivered = false;
                                    } else if (currentOrder.status === 'Delivered') {
                                        currentOrder.pending = false;
                                        currentOrder.inProgress = false;
                                        currentOrder.inTransit = false;
                                        currentOrder.delivered = true;
                                    }

                                    currentOrder.save()
                                })
                            }
                            res.render('orders/adminList', {orders: allOrders});
                        })
                    })
            } else {
                renderHome(res, 'You need to be an Admin to view all orders.');
            }
        })
    },
    productCreateGet: (req, res) => {
        let userId = req.user._id;

        User.findById(userId).then((currentUser) => {
            if (currentUser.roles[0] === 'Admin') {
                currentUser.isAdmin = true;
                currentUser.save()
                    .then(() => {
                        res.render('orders/createProduct')
                    })
            } else {
                renderHome(res, 'You need to be an Admin to create products.');
            }
        })
    },
    productCreatePost: (req, res) => {
        let productParams = req.body;
        productParams.toppings = productParams.toppings.split(', ');
        Product.create(productParams).then((currentProduct) => {
            res.redirect('/');
        }).catch((err) => {
            res.render('home/index', {globalError: err.message})
        })
    },
    placeOrderGet: (req, res) => {
        let productId = req.params.id;

        Product.findById(productId).then((currentProcut) => {
            res.render('orders/customize', {product: currentProcut});
        })
    },
    placeOrderPost: (req, res) => {
        let orderParams = req.body;

        Product.findById(orderParams.product).then((currentProduct) => {
            let currentOrder = {
                creator: req.user._id,
                category: orderParams.category,
                product: orderParams.product,
                toppings: [],
                date: Date.now().UTC,
            };

            for (let topping of currentProduct.toppings) {
                if (orderParams.hasOwnProperty(topping)) {
                    currentOrder.toppings.push(topping)
                }
            }

            if (currentOrder.toppings.length === 0) {
                currentOrder.toppings[0] = 'No toppings.';
            }

            Order.create(currentOrder).then((order) => {
                res.redirect('/');
            })
        })
    },
    orderDetailsGet: (req, res) => {
        let orderId = req.params.id;
        let userId = req.user._id;

        Order.findById(orderId).populate('creator').populate('product').then((currentOrder) => {
            let isPending = false;
            let isInProgress = false;
            let isInTransit = false;
            let isDelivered = false;

            if (currentOrder.status === 'Pending') {
                isPending = true;
            } else if (currentOrder.status === 'In Progress') {
                isInProgress = true;
            } else if (currentOrder.status === 'In Transit') {
                isInTransit = true;
            } else if (currentOrder.status === 'Delivered') {
                isDelivered = true;
            }

            User.findById(userId).then((user) => {
                res.render('orders/details', {
                    currentUser: user, order: currentOrder, pending: isPending, inProgress: isInProgress,
                    transit: isInTransit, delivered: isDelivered
                })
            })
        })
    },
    editOrder: (req, res) => {
        let orderId = req.params.id;

        Order.findById(orderId).then((currentOrder) => {
            currentOrder.status = req.body.status;
            currentOrder.save()
                .then(() => {
                    res.redirect('back');
                })
        })
    },
    deleteOrder: (req, res) => {
        let productId = req.params.id;

        Product.findOneAndRemove({_id: productId}).then((err) => {
            // my attempt to manage to delete all orders of the given product when it gets deleted

            // Order.find({}).then((allOrders) => {
            //     console.log(allOrders);
            //     for (let order of allOrders) {
            //         if (order.product === productId) {
            //             Order.findOneAndRemove({_id: order.id}).then(() => {
            //                 res.redirect('back')
            //             })
            //         }
            //     }
            // })

            res.redirect('back')
        })
    }
}