const cards = [
    {
        id: 1,
        name: "Card 1",
        front_text: "Card 1",
        back_text: "Back side of the card",
        times_studied: 3,
        times_correct: 2,
        times_incorrect: 1,
        tags: [{name: "Subject 1"}, {name: "Subject 2"}]
    },
    {id:2, name: "Card 2"},
    {id:3, name: "Card 3"},
    {id:4, name: "Card 4"},
    {id:5, name: "Card 5"},
    {id:6, name: "Card 6"},
    {id:7, name: "Card 7"},
    {id:8, name: "Card 8"},
]


exports.showCardDetails = (req, res) => {
    try {
        const card = cards[req.params.id - 1];
        const decks = [{
            id: 1,
            date_created: new Date(2024, 0, 1),
            name: "Deck 1",
            description: "Description",
            last_studied: new Date(2024, 3, 22),
            times_studied: 1,
        }];
        res.render("card_detail", {card: card, decks: decks});
    } catch {
        res.redirect("/cards");
    }
}


exports.getCardUpdateForm = (req, res) => {

}

exports.postCardUpdateForm = (req, res) => {

}

exports.getCardCreateForm = (req, res) => {
    res.render("card_form");
}

exports.postCardCreateForm = (req, res) => {

}

exports.listCards = (req, res) => {
    res.render("cards", {cards: cards});
}