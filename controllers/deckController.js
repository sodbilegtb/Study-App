const Deck = require("../models/deck");
const Card = require("../models/card");
const {FORBIDDEN} = require("http-status-codes");

module.exports = {
    index: (req, res, next) => {
        const filter = res.locals.user !== undefined ? {'user': res.locals.user} : {};
        Deck.find(filter)
            .populate("cards")
            .exec()
            .then(result => {
                res.locals.decks = result;
                next();
            }).catch(error => {
                next(error);
        })
    },
    indexView: (req, res) => {
        res.render("decks/index")
    },
    details: (req, res, next) => {
        Deck.findById(req.params.id)
            .populate("cards")
            .exec()
            .then(result => {
                // If user is set, check that the deck belongs to them
                if (res.locals.user !== undefined && !result.user._id.equals(res.locals.user._id)) {
                    res.status(FORBIDDEN);
                    throw new Error("This deck belongs to another user.");
                }
                res.locals.deck = result;
                res.locals.cards = result.cards;
                next();
            }).catch(error => {
                next(error);
        })
    },
    detailsView: (req, res) => {
        res.render("decks/details")
    },
    // Gets all user's cards so that they can be shown as options in the create form view
    getCardOptionsNew: (req, res, next) => {
        const filter = res.locals.user !== undefined ? {"user": res.locals.user} : {};
        Card.find(filter).exec()
            .then(result => {
                res.locals.cards = result;
                next();
            }).catch(error => {
                next(error);
        })
    },
    createView: (req, res) => {
        res.render("decks/form", {title: "Create new deck"});
    },
    create: (req, res, next) => { // Handles post on create view
        const newDeck = new Deck({
            user: res.locals.user,
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
                result.populate("cards")
                    .then(result => {
                        res.locals.deck = result;
                        res.locals.cards = result.cards;
                        next();
                    })
            })
            .catch(async (error) => {
                const cards = await Card.find().exec();
                if (error.name === 'ValidationError') {
                    console.log(error)
                    res.render("decks/form", {
                        title: 'Create new deck',
                        cards: cards,
                        errors: [error]
                    })
                } else {
                    next(error);
                }
            })
    },
    // Gets the cards in the deck and not in the deck so they can be added or removed
    // TODO check that the deck belongs to the user
    getCardOptionsEdit: (req, res, next) => {
        Deck.findById(req.params.id)
            .populate("cards")
            .exec()
            .then(deck => {
                res.locals.deck = deck;
                // https://www.mongodb.com/docs/manual/reference/operator/query/nin/
                // Find all cards that belong to the user and aren't in the deck
                const filter = res.locals.user !== undefined ? {_id: {$nin: deck.cards}, user: res.locals.user} :
                    {_id: {$nin: deck.cards}};
                Card.find(filter)
                    .exec()
                    .then(cards => {
                        res.locals.cards = cards;
                        next();
                    })
                    .catch(error => next(error));
            })
            .catch(error => next(error));
    },
    editView: (req, res) => {
        res.render("decks/form", {title: "Edit deck"});
    },
    // TODO check that the deck belongs to the user
    edit: async (req, res, next) => { // handles post to edit view
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
        Deck.findByIdAndUpdate(req.params.id, update, {returnDocument: "after"})
            .populate("cards")
            .exec()
            .then(result => {
                res.locals.deck = result;
                res.locals.cards = result.cards;
                next();
            })
            .catch(error => next(error));
    }
}