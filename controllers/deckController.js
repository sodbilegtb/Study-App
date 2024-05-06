const Deck = require("../models/deck");

exports.listDecks = async (req, res) => {
    await Deck.find()
        .then(result => {
            res.render("decks_list", {
                title: "List of Decks",
                decks: result
            });
        })
        .catch(err => {
            console.log(err);
            res.redirect("/404");
        });
}

exports.showDeckDetails = async (req, res) => {
    await Deck.findById(req.params.id)
        // .populate("cards") TODO
        .then(result => {
            res.render("deck_details", {
                title: "Details",
                deck: result,
                cards: result.cards
            })
        })
        .catch(err => {
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