const decks = [
    {
        name: "Deck 1",
        cards: [{}, {}]
    },
    {
        name: "Deck 2",
        cards: [{}, {}]
    },
    {
        name: "Deck 3",
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
    let deckId = req.params.id;
    console.log(deckId);
    // TODO check that the index is ok
    res.render("deck_details", {
        title: "Deck Details",
        deck: decks[deckId]
    });
}

exports.listCards = (req, res) => {
    let deckId = req.params.id;
    res.render("deck_cards", {
        title: "Cards",
        deck: decks[deckId],
        cards: decks[deckId].cards
    });
}