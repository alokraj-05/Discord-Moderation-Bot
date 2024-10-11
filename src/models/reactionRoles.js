const mongoose = require("mongoose");

const ReactionRoleSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
  },
  messageId: {
    type: String,
    required: true,
  },
  reactions: {
    type: String,
    required: true,
  },
  roles: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("reactionRole", ReactionRoleSchema);
