const mongoose = require("mongoose");

const userPermissionsSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  permissions: {
    type: [String], // Array of command names or permissions
    default: [],
  },
});

module.exports = mongoose.model("UserPermissions", userPermissionsSchema);
