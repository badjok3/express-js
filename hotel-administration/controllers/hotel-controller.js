const User = require('mongoose').model('User');
const Hotel = require('../models/Hotel');
const Comment = require('../models/Comment');

module.exports = {
    addHotelGet: (req, res) => {
        Hotel.find({}).then((hotels) => {
            res.render('hotels/generateHotel', {hotels: hotels})
        })
    },
    addHotelPost: (req, res) => {
        let hotelParams = req.body;
        let user = req.user._id;

        Hotel.create(hotelParams).then((hotel) => {
            User.findById(user).then((currentUser) => {
                currentUser.hotels.push(hotel._id);
                currentUser
                    .save()
                    .then(() => {
                        hotel.creator = user;
                        hotel
                            .save()
                            .then(() => {
                                res.render('home/index', {successMessage: 'Hotel created successfully'})
                            })
                    })
            })
        })
    },
    allHotelsGet: (req, res) => {
        Hotel.find({}).then((allHotels) => {
            allHotels = allHotels.sort((a) => a.creationDate);
            res.render('hotels/hotelList', {hotels: allHotels})
        })
    },
    likeHotel: (req, res) => {
        let id = req.params.id;

        Hotel.findById(id).then((hotel) => {
            let userId = req.user._id;
            let currentHotel = hotel.likes.find(h => h === userId);

            if (currentHotel != null) {
                let index = hotel.likes.indexOf(userId);
                hotel.likes.splice(index, 1);
            } else {
                hotel.likes.push(userId)
            }

            hotel.prop = hotel.likes.length;
            hotel.save()
                .then(() => {
                    res.redirect('back');
                })
        })
    },
    commentCreate: (req, res) => {
        let userId = req.user._id;

        User.findById(userId).then((user) => {
            let comment = {
                userName: user.username,
                userId: userId,
                userComment: req.body.comment,
                title: req.body.title,
            }

            Comment.create(comment).then((currentComment) => {

                let hotelId = req.params.id;
                Hotel.findById(hotelId).then((hotel) => {
                    hotel.comments.push(currentComment.id)
                    hotel
                        .save()
                        .then(() => {
                            user.comments.push(currentComment.id)
                            user
                                .save()
                                .then(() => {
                                    res.redirect('back')
                                })
                        })
                })
            })
        })
    },
    detailsGet: (req, res) => {
        let id = req.query.id;

        Hotel.findById(id).then((hotel) => {
            let allComments = []

            for (let comment of hotel.comments) {
                Comment.findById(comment).then((currentComment) => {
                    console.log(currentComment);
                    let exportComment = {
                        userComment: currentComment.userComment,
                        userName: currentComment.userName,
                        datePosted: currentComment.datePosted.UTC()
                    }

                    allComments.push(exportComment)
                })
            }

            hotel.views++;
            hotel
                .save()
                .then(() => {
                    res.render('hotels/details', {selectedHotel: hotel, comments: allComments})
                })
        })
    },
    editHotelGet: (req, res) => {
        let hotelId = req.params.id;

        Hotel.findById(hotelId).then((currentHotel) => {
            res.render('hotels/edit', {selectedHotel: currentHotel})
        })
    },
    editHotelPost: (req, res) => {
        let hotelId = req.params.id;
        Hotel.findById(hotelId).then((currentHotel) => {
            currentHotel.title = req.body.title;
            currentHotel.location = req.body.location;
            currentHotel.image = req.body.image;
            currentHotel.description = req.body.description;

            currentHotel.save()
                .then(() => {
                    res.redirect('/')
                })
        })
    },
    editCommentGet: (req, res) => {
        let commentId = req.params.id;

        Comment.findById(commentId).then((currentComment) => {
            res.render('hotels/editComment', {comment: currentComment});
        })
    },
    editCommentPost: (req, res) => {
        let commentId = req.params.id;

        Comment.findById(commentId).then((currentComment) => {
            currentComment.userComment = req.body.userComment;
            currentComment.title = req.body.title;
            currentComment.save()
                .then(() => {
                    res.redirect('/')
                })
        })
    },
    deleteHotel: (req, res) => {
        let hotelId = req.params.id;
        Hotel.findById(hotelId).then((currentHotel) => {
            for (let comment of currentHotel.comments) {
                Comment.deleteOne({_id: comment}).then(() => {
                    console.log('comment deleted');
                })
            }

            Hotel.deleteOne({_id: hotelId}).then((deletedHotel) => {
                res.redirect('back');
            })
        })
    },
    deleteComment: (req, res) => {
        let commentId = req.params.id;
        Comment.deleteOne({_id: commentId}).then(() => {
            res.redirect('back');
        })
    }
}