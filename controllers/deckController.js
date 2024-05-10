const Deck = require("../models/deck");

exports.listDecks = async (req, res, next) => {
    await Deck.find()
        .then(result => {
            res.render("decks/decks_list", {
                title: "List of Decks",
                decks: result
            });
        })
        .catch(err => next(err));
}

exports.showDeckDetails = async (req, res, next) => {
    await Deck.findById(req.params.id)
        // .populate("cards") TODO
        .then(result => {
            res.render("decks/deck_details", {
                deck: result,
                cards: result.cards
            })
        })
        .catch(err => next(err));
}

exports.listCards = async (req, res, next) => {
    await Deck.findById(req.params.id)
        // .populate("cards") TODO
        .then(result => {
            res.render("cards", {
                title: "Cards",
                cards: result.cards
            });
        })
        .catch(err => next(err))
}

exports.showCreateDeckForm = async (req, res) => {
    res.render("decks/deck_form", {});
}

exports.saveNewDeck = async (req, res, next) => {
    const newDeck = new Deck({
        name: req.body.name,
        description: req.body.description,
        notification: {
            enabled: req.body.notification_enabled,
            start_date: req.body.notification_start,
            days_between: req.body.notification_days
        }
    });
    await newDeck.save()
        .then(result => {
            res.render("decks/deck_details", {
                deck: result,
                cards: result.cards
            });
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                res.render("decks/deck_form", {
                    errors: [err]
                })
            } else {
                next(err);
            }
        })
}