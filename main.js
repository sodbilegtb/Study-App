const express = require("express"),
    mongoose = require("mongoose"),
    layouts = require("express-ejs-layouts"),
    session = require("express-session"),
    flash = require("connect-flash"),
    app = express();

const errorController = require("./controllers/errorController");

const homeRouter = require("./routes/home");
const usersRouter = require("./routes/users");
const decksRouter = require("./routes/decks");
const cardsRouter = require("./routes/cards");

const User = require("./models/user");

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://user:mLtTkYpXNIO7HY9m@cluster0.sapl7vk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { dbName: "agile-web" });

const db = mongoose.connection;
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose");
});

app.use(layouts);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
}));

app.use(flash());

app.use((req, res, next) => {
    if (req.session.userId) {
        User.findById(req.session.userId).exec()
            .then((user) => {
                if (user) {
                    res.locals.user = user;
                }
                next();
            })
            .catch(error => {
                next(error);
            });
    } else {
        next();
    }
});

app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});

app.use("/", homeRouter);
app.use("/users", usersRouter);
app.use("/decks", decksRouter);
app.use("/cards", cardsRouter);

app.use(errorController.errorHandler);

app.listen(app.get("port"), () => {
    console.log(`App started on port ${app.get("port")}.`);
});
