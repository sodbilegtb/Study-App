const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const deckSchema = new Schema({
    name: {type: String, minLength: 1},
    description: String,
    cards: { type: [Schema.Types.ObjectId], ref: "Card" },
    times_studied: {type: Number, min: 0, default: 0},
    date_created: {type: Date, default: Date.now},
    last_studied: Date,
    notification: {
        enabled: {type: boolean, default: false},
        start_date: {type: Date, default: Date.now},
        days_between: {type: Number, required: true, min: 1}
    }
});

module.exports = mongoose.model("Deck", deckSchema);



