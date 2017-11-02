const Product = require('../models/Product');
const User = require('mongoose').model('User');

function renderHome(res) {
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

        res.render('home/index', {chicken: chickenProducts, beef: beefProducts, lamb: lambProducts});
    })
}

module.exports = {
    index: (req, res) => {
        if (req.user) {
            let userId = req.user._id;
            User.findById(userId).then((currentUser) => {
                if (currentUser.roles[0] === 'Admin') {
                    currentUser.isAdmin = true;
                    currentUser.save()
                        .then(() => {
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

                                res.render('home/admin', {chicken: chickenProducts, beef: beefProducts, lamb: lambProducts});
                            })
                        })
                } else {
                    renderHome(res)
                }
            })
        } else {
            renderHome(res)
        }
    },
    about: (req, res) => {
        res.render('home/about');
    }
}
;