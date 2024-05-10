const express = require("express"),
    mongoose = require("mongoose"),
    layouts = require("express-ejs-layouts"),
    app = express();

const homeController = require("./controllers/homeController"),
    deckController = require("./controllers/deckController"),
    cardController = require("./controllers/cardController"),
    errorController = require("./controllers/errorController");
const {errorHandler} = require("./controllers/errorController");

app.set("port", process.env.port || 3000);
app.set("view engine", "ejs");

mongoose.connect("mongodb+srv://user:mLtTkYpXNIO7HY9m@cluster0.sapl7vk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {dbName: "agile-web"});

const db = mongoose.connection;
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose");
});

app.use(layouts);
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'))

app.get("/", homeController.showHome);

app.get("/decks", deckController.listDecks);
app.get("/decks/create", deckController.showCreateDeckForm);
app.post("/decks/create", deckController.saveNewDeck);
app.get("/decks/:id", deckController.showDeckDetails);
app.get("/decks/:id/cards", deckController.listCards);

app.get("/card/:id", cardController.showCardDetails);
app.get("/cards", cardController.listCards);

app.use(errorHandler);

app.listen(app.get("port"), () => {
    console.log(`App started on port ${app.get("port")}.`);

});


