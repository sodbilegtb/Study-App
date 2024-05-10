const CardModel = require("../models/card");

exports.showCardDetails = async (req, res) => {
    try {
        const card = await CardModel.findById(req.params.id);
        if (!card) {
            return res.redirect("/cards");
        }
        const decks = [
            {
                id: 1,
                date_created: new Date(2024, 0, 1),
                name: "Deck 1",
                description: "Description",
                last_studied: new Date(2024, 3, 22),
                times_studied: 1,
            }
        ];
        res.render("card_detail", { card: card, decks: decks });
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
        res.render("card_edit_form", { card });
    } catch (error) {
        console.error("Error fetching card:", error);
        res.redirect("/cards");
    }
};

exports.postCardEditForm = async (req, res) => {
    try {
        const cardId = req.params.id;
        const updatedCardData = {
            
        };
        const updatedCard = await CardModel.findByIdAndUpdate(cardId, updatedCardData, { new: true });
        res.redirect(`/cards/${updatedCard._id}`);
    } catch (error) {
        console.error("Error updating card:", error);
        res.redirect("/cards");
    }
};

exports.deleteCard = async (req, res) => {
    try {
        const cardId = req.params.id;
        await CardModel.findByIdAndDelete(cardId);
        res.redirect("/cards");
    } catch (error) {
        console.error("Error deleting card:", error);
        res.redirect("/cards");
    }
};
exports.listCards = async (req, res) => {
    try {
        const cards = await CardModel.find();
        res.render("cards", { cards: cards });
    } catch (error) {
        console.error("Error fetching cards:", error);
        res.redirect("/cards");
    }
};

exports.showCardCreateForm = (req, res) => {
    res.render("card_create_form");
};

exports.createCard = async (req, res) => {
    try {
        const { name, front_text, back_text, tags } = req.body;
        const card = new CardModel({
            name,
            front_text,
            back_text,
            tags: tags ? tags.split(",") : [],
        });
        await card.save();
        res.redirect("/cards");
    } catch (error) {
        console.error("Error creating card:", error);
        res.redirect("/cards/create");
    }
};

