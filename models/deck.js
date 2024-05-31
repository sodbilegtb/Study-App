const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const deckSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    name: {type: String, minLength: 1},
    description: String,
    cards: [{type: Schema.Types.ObjectId, ref: "Card", unique: true}],
    times_studied: {type: Number, min: 0, default: 0},
    last_studied: {type:Date, default: undefined},
    notification: {
        enabled: {type: Boolean, default: false},
        start_date: {type: Date, default: Date.now},
        days_between: {type: Number, min: 1, default: 1}
    }
},  { timestamps: true });

module.exports = mongoose.model("Deck", deckSchema);



