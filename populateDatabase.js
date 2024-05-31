const mongoose = require("mongoose");

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

async function deleteUsers() {
    await User.deleteMany()
        .exec()
        .then(result => {
            console.log(`Deleted ${result.deletedCount} users.`);
        })
        .catch(error => {
            console.log(`Error deleting users: ${error}`);
        });
}

function saveUser(user) {
    User.create(user)
        .then(user => {
            console.log(`Saved user: ${user}.`)
        })
        .catch(error => {
            console.log(`Error saving user: ${error.message}`);
        });
}

async function deleteDecks() {
    await Deck.deleteMany()
        .exec()
        .then(result => {
            console.log(`Deleted ${result.deletedCount} decks.`);
        })
        .catch(error => {
            console.log(`Error deleting decks: ${error.message}`);
        });
}

async function saveDeck(deck, user) {
    deck.user = user._id;
    await Deck.create(deck)
        .then(deck => {
            console.log(`Saved ${deck.name} for ${user.fullName}`);
        })
        .catch(error => {
            console.log(`Error saving deck: ${error.message}`);
        });
}

async function deleteCards() {
    await Card.deleteMany()
        .exec()
        .then(result => {
            console.log(`${result.deletedCount} cards deleted.`);
        }).catch(error => {
            console.log(`Error deleting cards: ${error.message}`);
        })
}

async function saveCard(card, user) {
    card.user = user._id;
    await Card.create(card)
        .then(result => {
            console.log(`Saved ${result.name}`);
        })
        .catch(error => {
            console.log(`Error saving card: ${error.message}`);
        });
}
function addCardToDeck(card, deck) {
    Card.findOne({'name': card.name}).exec()
        .then(c => {
            // console.log(c)
            deck.cards.push(c._id);
            Deck.findOneAndUpdate({'name': deck.name}, deck, {new: true})
                .populate("cards")
                .exec()
                .then(result => {
                    console.log(`Added ${card.name} to ${deck.name}.`);
                })
                .catch(error => {
                    console.log(`Error adding card to deck: ${error.message}`);
                })
        });
}

// Delete all users then save test users
// deleteUsers()
//     .then(() => {
//         testUsers.forEach(user => saveUser(user))
//     })
//     .catch(error => console.log(`${error.message}`));

// !Need to delete and add users separately first before running this
/* Deletes all cards and decks,
/* then saves first two test decks for user 1 and saves and adds cards,
/* then saves last three test decks for user 2 and saves and add cards */
deleteCards().then((result) => {
    deleteDecks()
        .then(() => {
            // Save part of the test decks as user1's decks
            User.findOne({'name.last': 'User 1'}).exec()
                .then(user1 => {
                    testDecks.slice(0, 2).forEach(deck => {
                        saveDeck(deck, user1).then(result => {
                            // Save first five cards, then add them to each of user1's decks
                            for (c of testCards.slice(0, 5)) {
                                if (deck === testDecks[0]) {
                                    console.log("SAVING CARD")
                                    saveCard(c, user1).then(() => {
                                        addCardToDeck(c, deck);
                                    }).catch(error => console.log(error));
                                } else {
                                    console.log("ADDING CARD")
                                    addCardToDeck(c, deck);
                                }
                            }
                        }).catch(error => console.log(error));
                    });
                }).catch(error => console.log(error));
            // Save part of the test decks as user2's decks
            User.findOne({'name.last': 'User 2'}).exec()
                .then(user2 => {
                    testDecks.slice(2, testDecks.length).forEach(deck => {
                        saveDeck(deck, user2).then(() => {
                            // Save remaining cards, then add them to each of user2's decks
                            testCards.slice(5, testCards.length).forEach(c => {
                                if (deck === testDecks[2]) {
                                    saveCard(c, user2).then(() => {
                                        addCardToDeck(c, deck);
                                    }).catch(error => console.log(error));
                                } else {
                                    addCardToDeck(c, deck);
                                }
                            })
                        }).catch(error => console.log(error));
                    });
                });
        });
});




