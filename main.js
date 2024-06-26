const express = require("express"),
    mongoose = require("mongoose"),
    layouts = require("express-ejs-layouts"),
    session = require("express-session"),
    flash = require("connect-flash"),
    passport = require("passport"),
    cookieParser = require("cookie-parser"),
    app = express();


const errorController = require("./controllers/errorController");

const homeRouter = require("./routes/home");
const usersRouter = require("./routes/users");
const decksRouter = require("./routes/decks");
const cardsRouter = require("./routes/cards");
const apiRouter = require("./routes/api");

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

app.use(cookieParser("your_secret_key"));
app.use(session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 600000000 }
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    if (!res.locals.data) {
        res.locals.data = {}
    }
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.user = req.user;
    res.locals.messages = req.flash();
    // res.locals.loggedIn ? console.log(`Logged in as ${res.locals.user}`) : console.log("Not logged in");
    next();
});

app.use("/", homeRouter);
app.use("/users", usersRouter);
app.use("/decks", decksRouter);
app.use("/cards", cardsRouter);
app.use("/api", apiRouter);

app.use(errorController.errorHandler);

app.listen(app.get("port"), () => {
    console.log(`App started on port ${app.get("port")}.`);
});
