const { REST } = require("discord.js");
const mongoose = require("mongoose");

const AfkSchema = new mongoose.Schema({
  userId: {
    type: "String",
    required: true,
  },
  guildId: {
    type: "String",
    required: true,
  },
  AfkReason: {
    type: "String",
    required: true,
  },
  afkTimeStamp: {
    type: "Date",
    required: true,
  },
});

module.exports = mongoose.model("AfkModal", AfkSchema);
