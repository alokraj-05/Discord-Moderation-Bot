const mongoose = require("mongoose");
const OverwriteSchema = new mongoose.Schema({
  id: String,
  allow: [String],
  deny: [String],
  type: String, // 'role' or 'member'
});

const ChannelSchema = new mongoose.Schema({
  name: String,
  type: Number,
  position: Number,
  userLimit: Number,
  parent: String,
  permissionOverwrites: [OverwriteSchema],
});

const CategorySchema = new mongoose.Schema({
  name: String,
  position: Number,
  channels: [ChannelSchema],
});

const RoleSchema = new mongoose.Schema({
  name: String,
  color: String,
  permissions: [String],
  position: Number,
  hoist: Boolean,
  mentionable: Boolean,
});

const GuildBackupSchema = new mongoose.Schema({
  guildId: String,
  roles: [RoleSchema],
  categories: [CategorySchema],
  backupKey: String,
});

module.exports = mongoose.model("Backup", GuildBackupSchema);
