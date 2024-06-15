const User = require("../models/user");
const Deck = require("../models/deck");
const Card = require("../models/card");
const bcrypt = require("bcrypt");

module.exports = {
    index: (req, res, next) => {
        User.find({}).exec()
            .then(async result => {
                res.locals.users = result;
                let userDecks = {};
                let userCards = {};
                for (const user of result) {
                    userDecks[user._id] = await Deck.countDocuments({ user: user }).exec();
                    userCards[user._id] = await Card.countDocuments({ user: user }).exec()
                }
                res.locals.userDecks = userDecks;
                res.locals.userCards = userCards;
                next();
            }).catch(error => {
                next(error);
            })
    },
    indexView: (req, res) => {
        res.render("users/index");
    },
    create: (req, res, next) => {
        const user = {
            name: {
                first: req.body.firstName,
                last: req.body.lastName
            },
            email: req.body.email,
            password: req.body.password
        };
    
        User.find({ email: user.email }).exec()
            .then((result) => {
                if (result.length === 0) {
                    User.create(user).then((user) => {
                        req.flash("success", `${user.fullName}'s account successfully created.`);
                        res.locals.user = user;
                        res.locals.redirect = `/users/${user._id}`;
                        next();
                    }).catch(err => {
                        next(err);
                    });
                } else {
                    throw new Error("A user account with this email already exists.");
                }
            }).catch(error => {
                req.flash("error", error.message);
                next(error);
        });
    },
    
    loginView: (req, res) => {
        res.render("users/login");
    },
    authenticate: (req, res, next) => {
        const { email, password } = req.body;
        console.log(`Attempting to authenticate user with email: ${email}`);

        User.findOne({ email: email }).exec()
            .then(user => {
                if (!user) {
                    console.log("User not found.");
                    req.flash("error", "User not found.");
                    return res.redirect("/users/login");
                }

                user.comparePassword(password, (err, isMatch) => {
                    if (err) {
                        console.error(`Error comparing password: ${err.message}`);
                        return next(err);
                    }
                    if (!isMatch) {
                        console.log("Invalid password.");
                        req.flash("error", "Invalid password.");
                        return res.redirect("/users/login");
                    }

                    console.log("Password matched. Logging in...");
                    req.session.userId = user._id;
                    req.flash("success", `${user.fullName}'s logged in successfully!`);
                    res.locals.redirect = "/";
                    next();
                });
            })
            .catch(error => {
                console.error(`Error finding user: ${error.message}`);
                next(error);
            });
    },
    createView: (req, res) => {
        res.render("users/new");
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) {
            res.redirect(redirectPath);
        } else {
            next();
        }
    },
    profileView: (req, res) => {
        User.findById(req.params.id).exec()
            .then(user => {
                res.locals.user = user;
                res.render("users/show");
            });
    },
    edit: (req, res, next) => {
        let userId = req.params.id,
            userParams = {
                name: {
                    first: req.body.firstName,
                    last: req.body.lastName
                },
                email: req.body.email,
                password: req.body.password
            };
        User.findByIdAndUpdate(userId, { $set: userParams })
            .then(user => {
                res.locals.redirect = `/users/${userId}`;
                res.locals.user = user;
                next();
            })
            .catch(error => {
                console.log(`Error updating user account: ${error.message}`);
                next(error);
            })
    },
    editView: (req, res) => {
        res.render("users/edit");
    },
    delete: (req, res, next) => {
        User.findByIdAndDelete(req.params.id)
            .then(() => {
                res.locals.user = undefined;
                if (req.query.list) {
                    res.locals.redirect = "/users";
                } else {
                    res.locals.redirect = "/";
                }
                next();
            }).catch((error) => {
                next(error);
            });
    }
}
