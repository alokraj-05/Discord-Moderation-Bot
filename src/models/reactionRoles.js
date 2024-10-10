const mongoose = require("mongoose");

const ReactionRoleSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
  },
  channelId: {
    type: String,
    required: true,
  },
  messageId: {
    type: String,
    required: true,
  },
  reactions: [
    {
      reactionId: {
        type: String,
        required: true,
      },
    },
  ],
  roles: [
    {
      roleid: {
        type: String,
        required: true,
      },
    },
  ],
  customMessage: {
    type: String,
  },
});

module.exports = mongoose.model("reactionRole", ReactionRoleSchema);
