const Car = require('../models/Car');
const User = require('../models/User');

module.exports = {
    createCarGet: (req, res) => {
        if (req.user.roles[0] === 'Admin') {
            res.render('car/create')
        } else {
            res.render('home/index', {msg: 'You need to be an Admin to access this page.'})
        }
    },
    createCarPost: (req, res) => {
        let carParams = req.body;

        Car.create(carParams).then((currentCar) => {
            let userId = req.user._id;
            User.findById(userId).then((currentUser) => {
                Car.find({}).then((allCars) => {

                    let availableCars = [];
                    for (let car in allCars) {
                        if (!car.isRented) {
                            availableCars.push(car);
                        }
                    }

                    res.redirect('/');
                })
            })
        })
    },
    allCarsGet: (req, res) => {
        let page = Number(req.query);

        Car.find({}).sort('-creationDate').then((allCars) => {
            let availableCars = []

            for (let car of allCars) {
                if (!car.isRented) {
                    availableCars.push(car)
                }
            }

            if (req.user) {
                let userId = req.user;

                User.findById(userId).then((currentUser) => {
                    if (currentUser.roles[0] === 'Admin') {
                        currentUser.isAdmin = true;
                        currentUser
                            .save()
                            .then(() => {
                                res.render('car/cars', {cars: availableCars, user: currentUser})
                            });
                    } else {
                        res.render('car/cars', {cars: availableCars, user: currentUser})
                    }
                })
            } else {
                res.render('car/cars', {cars: availableCars})

            }

        })
    },
    rentCarGet: (req, res) => {
        let id = req.params.id.substr(1, req.params.id.length);

        if(req.user) {
            Car.findById(id).then((currentCar) => {
                res.render('car/rent', {car: currentCar})
            });
        } else {
            res.render('home/index', {msg: 'You need to be logged in to rent cars.'})
        }
    },
    rentCarPost: (req, res) => {
        let userId = req.user._id;
        let id = req.params.id.substr(1, req.params.id.length);

        Car.findById(id).then((currentCar) => {
            currentCar.isRented = true;
            currentCar.days = +req.body.days;

            currentCar
                .save()
                .then(() => {
                    User.findById(userId).then((currentUser) => {
                        currentUser.cars.push(currentCar);
                        currentUser
                            .save()
                            .then(res.render('home/index', {msg: 'Car rented successfully! Happy driving.'}))
                    })
                })
        })
    },
    myCarsGet: (req, res) => {
        let id = req.params.id.substr(1, req.params.id.length);

        User.findById(id).then((currentUser) => {
            let myCars = [];

            currentUser.cars.forEach((carId) => {
                Car.findById(carId).then((currentCar) => {
                    currentCar.cost = currentCar.days * currentCar.pricePerDay;
                    myCars.push(currentCar)
                })
            })

            res.render('car/userCars', {cars: myCars})
        })
    },
    editCarGet: (req, res) => {
        let id = req.params.id.substr(1, req.params.id.length);

        if (req.user) {
            if (req.user.roles[0] === 'Admin') {
                Car.findById(id).then((currentCar) => {
                    res.render('car/edit', {car: currentCar})
                })
            } else {
                res.render('home/index', {msg: 'You need to be an Admin to access this page.'})
            }
        } else {
            res.render('home/index', {msg: 'You need to be an Admin to access this page.'})
        }
    },
    editCarPost: (req, res) => {
        let id = req.params.id.substr(1, req.params.id.length);

        let car = req.body;
        Car.findById(id).then((currentCar) => {

            currentCar.make = car.make;
            currentCar.model = car.model;
            currentCar.pricePerDay = car.pricePerDay;
            currentCar.year = car.year;
            currentCar.imageUrl = car.imageUrl;
            currentCar.description = car.description;
            currentCar.horsepower = car.horsepower;
            currentCar.engine = car.engine;

            currentCar
                .save()
                .then(() => {
                    res.redirect('/');
                })
        })
    }
}