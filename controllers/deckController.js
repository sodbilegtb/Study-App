const Deck = require("../models/deck");

exports.listDecks = async (req, res) => {
    await Deck.find()
        .then(result => {
            res.render("decks/decks_list", {
                title: "List of Decks",
                decks: result
            });
        })
        .catch(err => { // TODO
            console.log(err);
            res.redirect("/404");
        });
}

exports.showDeckDetails = async (req, res) => {
    await Deck.findById(req.params.id)
        // .populate("cards") TODO
        .then(result => {
            res.render("decks/deck_details", {
                deck: result,
                cards: result.cards
            })
        })
        .catch(err => { // TODO
            console.log(err);
            res.redirect("/404");
        });
}

exports.listCards = async (req, res) => {
    await Deck.findById(req.params.id)
        // .populate("cards") TODO
        .then(result => {
            res.render("cards", {
                title: "Cards",
                cards: result.cards
            });
        })
        .catch(err => {
            console.log(err)
            res.redirect("/404");
        })
}

exports.showCreateDeckForm = async (req, res) => {
    res.render("decks/deck_form", {});
}

exports.saveNewDeck = async (req, res) => {

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
            console.log(err); // TODO
            res.redirect("/decks");
        })
}