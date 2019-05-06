const
    mongoose = require("mongoose"),
    passpoerLocalmongoose = require("passport-local-mongoose");

let userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passpoerLocalmongoose);

module.exports = mongoose.model("User", userSchema);