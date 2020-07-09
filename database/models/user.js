const mongoose = require("mongoose");

const User = new mongoose.Schema({
  _id: String,

  tickets: { type: Array }
});

module.exports = mongoose.model("User", User);
