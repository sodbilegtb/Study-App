const bcrypt = require("bcrypt");
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
        },
        password: {
            type: String,
            required: true
        }
    }, {timestamps: true});

    userSchema.pre("save", function(next) {
        const user = this;
        if (!user.isModified("password")) return next();
    
        bcrypt.hash(user.password, 10, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
    
    // Method to compare passwords
    userSchema.methods.comparePassword = function(candidatePassword, cb) {
        bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
            if (err) return cb(err);
            cb(null, isMatch);
        });
    };
    
      module.exports = mongoose.model("User", userSchema);