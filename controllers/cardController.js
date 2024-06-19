const CardModel = require("../models/card");
const Deck = require("../models/deck");

exports.showCardDetails = async (req, res) => {
    try {
        const card = await CardModel.findById(req.params.id);
        if (!card) {
            return res.redirect("/cards");
        }
        const decks = [
            {
                id: 1,
                name: "Deck 1",
                description: "Description",
                last_studied: new Date(2024, 3, 22),
                times_studied: 1,
            }
        ];
        res.render("cards/card_detail", {card: card, decks: decks});
    } catch (error) {
        console.error("Error fetching card:", error);
        res.redirect("/cards");
    }
};

exports.getCardEditForm = async (req, res) => {
    try {
        const card = await CardModel.findById(req.params.id);
        if (!card) {
            return res.redirect("/cards");
        }
        res.render("cards/card_edit_form", {card});
    } catch (error) {
        console.error("Error fetching card:", error);
        res.redirect("/cards");
    }
};

exports.postCardEditForm = async (req, res) => {
    try {
        const cardId = req.params.id;
        const updatedCardData = {
            name: req.body.name,
            front_text: req.body.front_text,
            back_text: req.body.back_text,
            tags: req.body.tags.split(','),
        };
        const updatedCard = await CardModel.findByIdAndUpdate(cardId, updatedCardData, {new: true});
        res.redirect(`/cards`);
    } catch (error) {
        console.error("Error updating card:", error);
        res.redirect("/cards");
    }
};

exports.deleteCard = async (req, res, next) => {
    try {
        const cardId = req.params.id;
        await CardModel.findByIdAndDelete(cardId);
        res.locals.redirect = "/cards";
        next();
    } catch (error) {
        console.error("Error deleting card:", error);
        next(error.message);
    }
};

exports.listCards = async (req, res) => {
    CardModel.find({user: res.locals.user._id})
        .exec()
        .then(async (cards) => {
            cardDecks = []
            for (card of cards) {
                cardDecks[card._id] = await Deck.find({cards: card, user: res.locals.user._id})
                    .exec();
            }
            res.render("cards/cards", {cards: cards, decks: cardDecks});
        }).catch(error => {
        console.error("Error fetching cards:", error);
        res.redirect("/cards");
    });
}

    exports.showCardCreateForm = (req, res) => {
        res.render("cards/card_create_form");
    };

    exports.createCard = async (req, res) => {
        try {
            const {name, front_text, back_text, tags} = req.body;
            const card = new CardModel({
                user: res.locals.user,
                name,
                front_text,
                back_text,
                tags: tags ? tags.split(",") : [],
            });
            await card.save();
            res.redirect("/cards");
        } catch (error) {
            console.error("Error creating card:", error);
            res.redirect("/create");
        }
    };

    exports.redirectView = (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) {
            res.redirect(redirectPath);
        } else {
            next();
        }
    };
