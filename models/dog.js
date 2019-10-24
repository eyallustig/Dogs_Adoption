const mongoose = require('mongoose');

const dogSchema = new mongoose.Schema({
    name: String,
    breed: String,
    address: String,
    image: String,
    age: String,
    gender: String,
    size: String,
    description: String
});

module.exports = mongoose.model("Dog", dogSchema);