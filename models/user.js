const mongoose = require("mongoose"),
    {Schema} = mongoose,
    userSchema = new Schema({
        name: {
            first: {
                type: String,
                trim: true
            },
            last: {
                type: String,
                trim: true
            }
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        }
    }, {timestamps: true});

userSchema.virtual("fullName").get(function() {
    return `${this.name.first} ${this.name.last}`
});

module.exports = mongoose.model("User", userSchema);