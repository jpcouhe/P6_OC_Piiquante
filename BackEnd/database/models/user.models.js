const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

userSchema.statics.hashPassword = async (password) => {
    try {
        return bcrypt.hash(password, 12);
    } catch (e) {
        throw e;
    }
};

userSchema.statics.comparePassword = async function (password, userpassword) {
    try {
        return bcrypt.compare(password, userpassword);
    } catch (error) {
        throw e;
    }
};

module.exports = mongoose.model("User", userSchema);
