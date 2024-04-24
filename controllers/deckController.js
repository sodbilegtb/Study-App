const decks = [
    {
        id: 1,
        name: "Deck 1",
        description: "Description",
        last_studied: null,
        cards: null,
    },
    {
        id: 2,
        name: "Deck 2",
        description: "Description",
        last_studied: null,
        cards: []
    },
    {
        id: 3,
        name: "Deck 3",
        description: "Description",
        last_studied: null,
        cards: [{}, {}]
    },
    {
        id: 4,
        name: "Spanish",
        description: "Unit 2 Vocabulary",
        last_studied: null,
        cards: [{}, {}]
    },
    {
        id: 5,
        name: "Deck 5",
        description: "Description",
        last_studied: null,
        cards: [{}, {}]
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
        let deck = decks[req.params.id-1];
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
        let deck = decks[req.params.id-1];
        res.render("cards", {
            title: "Cards",
            cards: deck.cards
        });
    } catch (e) {
        res.redirect("/404");
    }
}