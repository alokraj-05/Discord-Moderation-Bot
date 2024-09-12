const mongoose = require("mongoose");

const prefixSchema = new mongoose.Schema({
  guildId: {
    type: "string",
    required: true,
    unique: true,
  },
  prefix: {
    type: "string",
    required: true,
    default: "S!",
  },
});

module.exports = mongoose.model("Prefix", prefixSchema);
