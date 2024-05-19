const Deck = require("../models/deck");
const Card = require("../models/card");

exports.listDecks = (req, res, next) => {
    Deck.find()
        .populate("cards")
        .exec()
        .then(result => {
            res.render("decks/decks_list", {
                title: "List of Decks",
                decks: result
            });
        })
        .catch(err => next(err));
}

exports.showDeckDetails = (req, res, next) => {
    Deck.findById(req.params.id)
        .populate("cards")
        .exec()
        .then(result => {
            res.render("decks/deck_details", {
                deck: result,
                cards: result.cards
            })
        })
        .catch(err => next(err));
}

exports.listCards = (req, res, next) => {
    Deck.findById(req.params.id)
        .populate("cards")
        .exec()
        .then(result => {
            res.render("cards", {
                title: "Cards",
                cards: result.cards
            });
        })
        .catch(err => next(err))
}

exports.showCreateDeckForm = (req, res, next) => {
    // Get all cards to show them as options that can be added to the deck in the view
    Card.find({}).exec()
        .then(result => {
            res.render("decks/deck_form", {title: 'Create new deck', cards: result});
        })
        .catch(error => next(error));
}

exports.showEditDeckForm = async (req, res, next) => {
    const deck = await Deck.findById(req.params.id).populate("cards").exec();
    // https://www.mongodb.com/docs/manual/reference/operator/query/nin/
    // Find all cards except the ones in the deck
    Card.find({_id: {$nin: deck.cards}}).exec()
        .then((result) => {
            res.render("decks/deck_form", {
                title: "Edit deck",
                cards: result,
                deck: deck
            })
        }).catch(err => next(err))
}

exports.saveNewDeck = async (req, res, next) => {
    const newDeck = new Deck({
        name: req.body.name,
        description: req.body.description,
        cards: req.body.cards_to_add,
        notification: {
            enabled: req.body.notification_enabled,
            start_date: req.body.notification_start,
            days_between: req.body.notification_days
        }
    });
    newDeck.save()
        .then(result => {
            res.render("decks/deck_details", {
                deck: result,
                cards: result.cards
            });
        })
        .catch(async (err) => {
            const cards = await Card.find().exec();
            if (err.name === 'ValidationError') {
                res.render("decks/deck_form", {
                    title: 'Create new deck',
                    cards: cards,
                    errors: [err]
                })
            } else {
                next(err);
            }
        })
}

exports.updateDeck = async (req, res, next) => {
    let {name, description, cards_to_add, cards_to_remove} = req.body
    if (cards_to_add === undefined) {
        cards_to_add = []
    }
    if (cards_to_remove === undefined) {
        cards_to_remove = []
    }
    const deck = await Deck.findById(req.params.id);
    // Remove cards
    let updatedCards = deck.cards.filter((c) => {
        return cards_to_remove.indexOf(c.toString()) === -1
    })
    // Add cards
    updatedCards = updatedCards.concat(cards_to_add);
    // The changes to make
    const update = {
        name,
        description,
        cards: updatedCards,
        notification: {
            enabled: req.body.notification_enabled,
            start_date: req.body.notification_start,
            days_between: req.body.notification_days
        }
    }
    // Apply the changes to the deck and show deck details page
    Deck.findByIdAndUpdate(req.params.id, update, {returnDocument: "after"}).populate("cards").exec()
        .then(deck => {
            res.render("decks/deck_details", {
                deck: deck,
                cards: deck.cards
            })
        })
        .catch(err => {
            next(err)
        });
}