const cards = [
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
    {name: "Card 5"},
    {name: "Card 6"},
    {name: "Card 7"},
    {name: "Card 8"},
]
exports.showCardDetails = (req, res) => {

}

exports.listCards = (req, res) => {
    res.render("cards", {cards: cards});
}