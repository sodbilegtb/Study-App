const decks = [
    {
        id: 1,
        date_created: new Date(2024, 0, 1),
        name: "Deck 1",
        description: "Description",
        last_studied: new Date(2024, 3, 22),
        times_studied: 1,
        cards: null,
    },
    {
        id: 2,
        date_created: new Date(2024, 0, 1),
        name: "Deck 2",
        description: "Description",
        last_studied: null,
        times_studied: 1,
        cards: []
    },
    {
        id: 3,
        date_created: new Date(2024, 0, 1),
        name: "Deck 3",
        description: "Description",
        last_studied: null,
        times_studied: 0,
        cards: [{name: "Card 1"}, {name: "Card 2"}]
    },
    {
        id: 4,
        date_created: new Date(2024, 0, 1),
        name: "Spanish",
        description: "Unit 2 Vocabulary",
        last_studied: null,
        times_studied: 0,
        cards: [{name: "Card 1"}, {name: "Card 2"}]
    },
    {
        id: 5,
        date_created: new Date(2024, 0, 1),
        name: "Deck 5",
        description: "Description",
        last_studied: null,
        times_studied: 0,
        cards: [
            {
                name: "Card 1",
                front_text: "Card 1",
                back_text: "Back side of the card",
                times_studied: 3,
                times_correct: 2,
                times_incorrect: 1
            },
            {name: "Card 2"},
            {name: "Card 3"},
            {name: "Card 4"},
            {name: "Card 5"}]
    }
]

exports.listDecks = (req, res) => {
    res.render("decks_list", {
        title: "List of Decks",
        decks: decks,
    })
}
exports.showDeckDetails = (req, res) => {
    try {
        let deck = decks[req.params.id - 1];
        res.render("deck_details", {
            title: "Details",
            deck: deck,
            cards: deck.cards
        });
    } catch (e) {
        res.redirect("/404");
    }
}

exports.listCards = (req, res) => {
    try {
        let deck = decks[req.params.id - 1];
        res.render("cards", {
            title: "Cards",
            cards: deck.cards
        });
    } catch (e) {
        res.redirect("/404");
    }
}