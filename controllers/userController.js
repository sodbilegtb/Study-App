const User = require("../models/user");
const Deck = require("../models/deck");
const Card = require("../models/card");
const passport = require("passport");

module.exports = {
    index: (req, res, next) => {
        User.find({}).exec()
            .then(async result => {
                res.locals.users = result;
                let userDecks = {};
                let userCards = {};
                for (const user of result) {
                    userDecks[user._id] = await Deck.countDocuments({user: user}).exec();
                    userCards[user._id] = await Card.countDocuments({user: user}).exec()
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
            email: req.body.email
        };

        User.register(user, req.body.password, (error, user) => {
            if (user) {
                req.flash("success", `${user.fullName}'s account created successfully`);
                res.locals.redirect = "/";
                next();
            } else {
                req.flash("error", `Failed to create user account: ${error.message}`);
                res.locals.redirect = "/users/new";
                next();
            }
        })
    },
    loginView: (req, res) => {
        res.render("users/login");
    },
    authenticate: passport.authenticate("local", {
        failureRedirect: "/users/login",
        failureFlash: "Failed to login",
        successRedirect: "/",
        successFlash: "You have successfully logged in!",
        keepSessionInfo: true
    }),
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
                res.render("users/show", {profile: user});
            });
    },
    edit: (req, res, next) => {
        let userId = req.params.id,
            userParams = {
                name: {
                    first: req.body.firstName,
                    last: req.body.lastName
                },
                email: req.body.email
            };

        User.findByIdAndUpdate(userId, {$set: userParams})
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
    editPasswordView: (req, res) => {
        res.render("users/edit_password")
    },
    editPassword: (req, res, next) => {
        let oldPassword = req.body.oldPassword;
        let newPassword = req.body.newPassword;
        let user = res.locals.user;
        user.changePassword(oldPassword, newPassword)
            .then(() => {
                res.locals.redirect = `/users/${user._id}`;
                req.flash("success", "Password succesfully changed");
                next();
            })
            .catch(error => {
                res.locals.redirect = `/users/${user._id}/edit/password`;
                req.flash("error", `Error changing password: ${error.message}`);
                next();
            });
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
    },
    logout: (req, res, next) => {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "You have been logged out!");
            res.locals.redirect = "/";
            next();
        });
    }
    
}
