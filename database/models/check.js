const mongoose = require("mongoose");

const Check = new mongoose.Schema({
  channel: String,
  transaction: String
});

module.exports = mongoose.model("Check", Check);
