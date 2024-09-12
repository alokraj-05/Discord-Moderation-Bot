const mongoose = require("mongoose");

const guildSettingsSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  welcomeChannelId: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("GuildSettings", guildSettingsSchema);
