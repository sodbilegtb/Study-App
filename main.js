const express = require("express"),
    layouts = require("express-ejs-layouts"),
    app = express();

const homeController = require("./controllers/homeController"),
    deckController = require("./controllers/deckController"),
    errorController = require("./controllers/errorController");

app.set("port", process.env.port || 3000);
app.set("view engine", "ejs");

app.use(layouts);
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'))

app.get("/", homeController.showHome);
app.get("/decks", deckController.listDecks);
app.get("/404", errorController.pageNotFoundError);

app.listen(app.get("port"), () => {
    console.log(`App started on port ${app.get("port")}.`);
});