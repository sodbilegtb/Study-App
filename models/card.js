const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cardSchema = new Schema({
    name: { type: String, required: true },
    front_text: { type: String, required: true },
    back_text: { type: String, required: true },
    times_studied: { type: Number, default: 0 },
    times_correct: { type: Number, default: 0 },
    times_incorrect: { type: Number, default: 0 },
    tags: [{ name: String }],
});

module.exports = mongoose.model("Card", cardSchema);
