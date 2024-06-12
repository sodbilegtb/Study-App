const express = require("express"),
    mongoose = require("mongoose"),
    layouts = require("express-ejs-layouts"),
    app = express();

const errorController = require("./controllers/errorController");

const homeRouter = require("./routes/home");
const usersRouter = require("./routes/users");
const decksRouter = require("./routes/decks");
const cardsRouter = require("./routes/cards");

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
    let lastName = 'User 1';
    User.findOne({'name.last': lastName})
        .exec()
        .then((user) => {
            if (user === null) {
                console.log(`No user with last name ${lastName} found`);
                throw new Error("User was not found.");
            }
            res.locals.user = user;
            next();
        })
        .catch(error => {
            next(error);
        });
});

app.use("/", homeRouter);
app.use("/users", usersRouter);
app.use("/decks", decksRouter);
app.use("/cards", cardsRouter);

app.use(errorController.errorHandler);

app.listen(app.get("port"), () => {
    console.log(`App started on port ${app.get("port")}.`);
});


