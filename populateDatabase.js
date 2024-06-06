const mongoose = require("mongoose")

const User = require("./models/user"),
    Deck = require("./models/deck"),
    Card = require("./models/card");

const testUsers = require("./testData/testUsers");
const testDecks = require("./testData/testDecks");
const testCards = require("./testData/testCards");

mongoose.connect("mongodb+srv://user:mLtTkYpXNIO7HY9m@cluster0.sapl7vk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {dbName: "agile-web"});

const db = mongoose.connection;
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose");
});

Promise.all([
    User.deleteMany().exec(),
    Deck.deleteMany().exec(),
    Card.deleteMany().exec()
]).then(() => {
    console.log("Cleared database");
    for (let i = 0; i < testUsers.length; i++) {
        let decksStart = i * testDecks.length / testUsers.length;
        let decksEnd = decksStart + testDecks.length / testUsers.length;
        let cardsStart = i * testCards.length / testUsers.length;
        let cardsEnd = cardsStart + testCards.length / testUsers.length;
        User.create(testUsers[i])
            .then(user => {
                let userCards = testCards.slice(cardsStart, cardsEnd);
                userCards.forEach((card) => {
                    card.user = user;
                });
                Card.insertMany(userCards)
                    .then((savedCards) => {
                        console.log(`${savedCards.length} cards inserted`)
                        let userDecks = testDecks.slice(decksStart, decksEnd);
                        userDecks.forEach((userDeck) => {
                            userDeck.user = user;
                            savedCards.forEach((c) => {
                                userDeck.cards.push(c);
                            });
                            console.log(userDeck)
                            Deck.create(userDeck)
                                .then((deck) => {
                                    console.log(`Saved deck "${deck.name}" for user "${user.name.first} ${user.name.last}" with ${deck.cards.length} cards`)
                                })
                                .catch((error) => {
                                    console.log(`Error creating deck: ${error.message}`);
                                })
                        });
                    })
                    .catch(error => {
                        console.log(`Error inserting cards: ${error.message}`);
                    })
            })
    }
})