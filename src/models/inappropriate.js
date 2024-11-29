const mongoose = require("mongoose");
const InappropriateWords = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
  },
  enabled: {
    type: Boolean,
    required: true,
    default: false,
  },
  roleId: [String],
  words: [
    {
      word: {
        type: String,
        required: true,
      },
    },
  ],
  actions: [
    {
      action: {
        type: String,
      },
    },
  ],
  limit: {
    type: Number,
  },
  culpableUsers: [
    {
      userId: {
        type: String,
      },
      userName: {
        type: String,
      },
      userWarn: {
        type: Number,
        default: 0,
      },
    },
  ],
});

module.exports = mongoose.model("inappropriateWords", InappropriateWords);
