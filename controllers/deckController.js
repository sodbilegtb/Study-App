const Deck = require("../models/deck");
const Card = require("../models/card");
const httpStatus = require("http-status-codes");

module.exports = {
    index: (req, res, next) => {
        if (!res.locals.user) {
            req.flash("error", `Please login first`);
            res.locals.redirect = "/users/login";
            next();
        } else {
            const filter = {'user': res.locals.user};
            Deck.find(filter)
                .populate("cards")
                .exec()
                .then(result => {
                    res.locals.data.decks = result;
                    next();
                }).catch(error => {
                next(error);
            })
        }
    },
    indexView: (req, res) => {
        res.render("decks/index")
    },
    details: (req, res, next) => {
        if (!res.locals.user) {
            req.flash("error", `Please login first`);
            res.locals.redirect = "/users/login";
            next();
        } else {
            Deck.findById(req.params.id)
                .populate("cards")
                .exec()
                .then(result => {
                    if (!result.user._id.equals(res.locals.user._id)) {
                        req.flash("error", `Deck belongs to another user`);
                        res.locals.redirect = "/decks";
                    } else {
                        res.locals.data.deck = result;
                    }
                    next();
                }).catch(error => {
                    next(error);
            })
        }
    },
    detailsView: (req, res) => {
        res.render("decks/show")
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
            res.render("decks/new");
        },
    create: (req, res, next) => {
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
                .catch((error) => {
                    req.flash("error", `Error creating deck: ${error.message}`);
                    res.locals.redirect = "/decks/create";
                    next();
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
            res.render("decks/edit");
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
            Deck.findByIdAndUpdate(req.params.id, {$set: update}, {returnDocument: "after"})
                .populate("cards")
                .exec()
                .then(result => {
                    res.locals.deck = result;
                    res.locals.cards = result.cards;
                    next();
                })
                .catch(error => next(error));
        },
    delete: (req, res, next) => {
            Deck.findByIdAndDelete(req.params.id).exec()
                .then(() => {
                    res.locals.redirect = "/decks";
                    next();
                })
                .catch((error) => {
                    next(error.message);
                })
        },
    redirectView: (req, res, next) => {
            let redirectPath = res.locals.redirect;
            if (redirectPath) {
                res.redirect(redirectPath);
            } else {
                next();
            }
        },
    respondJSON: (req, res) => {
        res.locals.messages = req.flash();
        if (!res.locals.loggedIn) {
            throw new Error("Please login first");
        }
        if ("error" in res.locals.messages) {
            throw new Error(res.locals.messages["error"])
        }
        res.json({
            status: httpStatus.OK,
            data: res.locals.data
        });
    },
    errorJSON: (error, req, res, next) => {
            let errorObject;

            if (error) {
                errorObject = {
                    status: httpStatus.INTERNAL_SERVER_ERROR,
                    message: error.message
                }
            } else {
                errorObject = {
                    status: httpStatus.INTERNAL_SERVER_ERROR,
                    message: "Unknown error"
                }
            }
            res.json(errorObject);
        }
}