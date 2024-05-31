const mongoose = require("mongoose");
const Deck = require("./deck");
const Schema = mongoose.Schema;

const cardSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref:"User", required: true},
    name: { type: String, required: true },
    front_text: { type: String, required: true },
    back_text: { type: String, required: true },
    times_studied: { type: Number, default: 0 },
    times_correct: { type: Number, default: 0 },
    times_incorrect: { type: Number, default: 0 },
    tags: [{ name: String }],
});

// https://mongoosejs.com/docs/middleware.html
cardSchema.pre('deleteOne', function(next) {
    console.log('Middleware on parent document'); // Will be executed
});

cardSchema.pre('deleteMany', function() {
    Deck.find({cards: this._id}).exec()
        .then((deck) => {
            if (deck.length > 0) {
                console.log(deck)
                console.log(deck.cards)
                deck.cards = deck.cards.filter(c => !c._id.equals(this._id))
                deck.save();
            }
        });
});

module.exports = mongoose.model("Card", cardSchema);
