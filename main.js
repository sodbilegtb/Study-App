const express = require("express"),
    mongoose = require("mongoose"),
    layouts = require("express-ejs-layouts"),
    app = express();

const homeController = require("./controllers/homeController"),
    deckController = require("./controllers/deckController"),
    cardController = require("./controllers/cardController"),
    usersController = require("./controllers/userController"),
    errorController = require("./controllers/errorController");

const User = require("./models/user");

app.set("port", process.env.port || 3000);
app.set("view engine", "ejs");

mongoose.Promise = global.Promise
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

// Set the user to test user 1 for now
app.use((req, res, next) => {
    User.findOne({'name.last': 'User 1'})
        .exec()
        .then((user) => {
            res.locals.user = user;
            next();
        })
        .catch(error => {
            console.log(error.message);
            next();
        });
});

app.get("/", homeController.showHome);
app.get("/users", usersController.index, usersController.indexView);

app.get("/decks", deckController.index, deckController.indexView); // shows all decks
app.get("/decks/create", deckController.getCardOptionsNew, deckController.createView); // shows create form
app.post("/decks/create", deckController.create, deckController.detailsView);
app.get("/decks/:id", deckController.details, deckController.detailsView);
app.get("/decks/:id/edit", deckController.getCardOptionsEdit, deckController.editView);
app.post("/decks/:id/edit", deckController.edit, deckController.detailsView);

app.get("/card/:id", cardController.showCardDetails);
app.get("/cards", cardController.listCards);

app.get("/cards/:id/edit", cardController.getCardEditForm);
app.post("/cards/:id/edit", cardController.postCardEditForm);
app.post("/cards/:id/delete", cardController.deleteCard);

app.get("/cards/create", cardController.showCardCreateForm);
app.post("/cards/create", cardController.createCard);

app.use(errorController.errorHandler);

app.listen(app.get("port"), () => {
    console.log(`App started on port ${app.get("port")}.`);
});


