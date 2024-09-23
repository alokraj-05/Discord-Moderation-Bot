const mongoose = require("mongoose");
const joinRoleSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
  },
  roles: [
    {
      roleId: { type: String, required: true },
      roleName: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("joinRole", joinRoleSchema);
