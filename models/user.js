const passportLocalMongoose = require("passport-local-mongoose");

const mongoose = require("mongoose"),
    {Schema} = mongoose,
    userSchema = new Schema({
        name: {
            first: {
                type: String,
                minLength: 1,
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
        }
    }, {timestamps: true});

userSchema.virtual("fullName").get(function() {
    return `${this.name.first} ${this.name.last}`;
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: "email"
});

module.exports = mongoose.model("User", userSchema);