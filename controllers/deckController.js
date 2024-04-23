const decks = [
    {
        name: "Deck 1",
        description: "Description",
        last_studied: null,
        cards: [{
        }, {}, {}]
    },
    {
        name: "Deck 2",
        description: "Description",
        last_studied: null,
        cards: []
    },
    {
        name: "Deck 3",
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
        let deck = decks[req.params.id];
        res.render("deck_details", {
            title: "Deck Details",
            deck: decks[deckId]
        });
    } catch (e) {
        res.redirect("/404");
    }
}

exports.listCards = (req, res) => {
    try {
        let deck = decks[req.params.id];
        res.render("deck_cards", {
            title: "Cards",
            deck: deck,
            cards: deck.cards
        });
    } catch (e) {
        res.redirect("/404");
    }
}