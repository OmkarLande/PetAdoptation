const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: String,
  species: String,
  breed: String,
  vaccination: String,
  imageUrl: String,
});

module.exports = mongoose.model('Pet', petSchema);
