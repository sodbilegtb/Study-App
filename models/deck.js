const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const deckSchema = new Schema({
    name: {type: String, minLength: 1},
    description: String,
    cards: [],
    times_studied: {type: Number, min: 0, default: 0},
    date_created: {type: Date, default: Date.now},
    last_studied: {type:Date, default: undefined},
    notification: {
        enabled: {type: Boolean, default: false},
        start_date: {type: Date, default: Date.now},
        days_between: {type: Number, min: 1, default: 1}
    }
});

module.exports = mongoose.model("Deck", deckSchema);



