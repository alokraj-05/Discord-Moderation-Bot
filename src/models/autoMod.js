const mongoose = require("mongoose");

const autoModSchema = mongoose.Schema({
  rid: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  rName: {
    type: String,
    required: true,
  },
  creator_id: {
    type: String,
    required: true,
  },
  event_type: {
    type: Number,
    required: true,
  },
  trigger_type: {
    type: Number,
    required: true,
  },
  action: [
    {
      type: Number,
      required: true,
      metadata: {
        message: {
          type: String,
          required: false,
        },
      },
    },
  ],
  trigger_metadata: {
    keyword_filter: { type: [String], required: true },
    regex_patterns: ["(b|c)at", "^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$"],
  },
  enbaled: {
    type: Boolean,
    required: true,
  },
  exempt_roles: {
    type: String,
    required: true,
  },
  exempt_channels: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("AutoMod", autoModSchema);
