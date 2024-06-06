const User = require("../models/user");
const Deck = require("../models/deck");
const Card = require("../models/card");

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
    }
}