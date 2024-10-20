const mongoose = require("mongoose");
const newsGuildSchema = new mongoose.Schema(
  {
    guildId: {
      type: "String",
      required: true,
    },
    CId: { type: "String", required: true },
    lastCheck: { type: "Date", required: true },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("NewsSchema", newsGuildSchema);
