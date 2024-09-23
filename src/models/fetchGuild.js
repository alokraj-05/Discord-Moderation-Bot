const mongoose = require("mongoose");

const GuildDataSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  guildName: {
    type: String,
    required: true,
  },
  guildOwnerId: {
    type: String,
    required: true,
  },
  guildOwnerName: {
    type: String,
    required: true,
  },
  totalRoles: {
    type: Number,
    required: true,
  },
  roleIds: {
    type: [String],
    required: true,
  },
  guildCreatedDate: {
    type: Date,
    required: true,
  },
  boostCount: {
    type: Number,
    required: true,
  },
  guildBoostLevel: {
    type: String,
    required: true,
  },
  totalTextChannels: {
    type: Number,
    required: true,
  },
  textChannelIds: {
    type: [String],
    required: true,
  },
  totalVoiceChannels: {
    type: Number,
    required: true,
  },
  voiceChannelIds: {
    type: [String],
    required: true,
  },
  highestRole: {
    type: String,
    required: true,
  },
  highestRoleId: {
    type: String,
    required: true,
  },
  memberCount: {
    type: Number,
    required: true,
  },
  onlineMemberCount: {
    type: Number,
    required: true,
  },
  afkChannelId: {
    type: String,
    default: null,
  },
  afkChannelName: {
    type: String,
    default: null,
  },
  afkTimeout: {
    type: Number, // Timeout duration in seconds
    default: 0,
  },
  verificationLevel: {
    type: String,
    required: true,
  },
  explicitContentFilter: {
    type: String,
    required: true,
  },
  defaultMessageNotifications: {
    type: String,
    required: true,
  },
  mfaLevel: {
    type: String, //Multi-Factor Authentication (MFA) level required for administrative actions.
    required: true,
  },
  systemChannelId: {
    type: String,
    default: null,
  },
  systemChannelName: {
    type: String, //The ID and name of the system channel where welcome messages, boost notifications, etc., are sent.
    default: null,
  },
  features: {
    type: [String], // Array of feature strings like "ANIMATED_ICON", "BANNER",
    default: [],
  },
  region: {
    type: String,
    required: true,
  },
  locale: {
    type: String, // The server region or locale (language) setting of the guild.
    required: true,
  },
  boostTier: {
    type: String,
    required: true,
  },
  boostingMembersCount: {
    type: Number,
    required: true,
  },
  bannerURL: {
    type: String,
    default: null,
  },
  iconURL: {
    type: String,
    default: null,
  },
  rulesChannelId: {
    type: String,
    default: null,
  },
  rulesChannelName: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: null,
  },
  announcementsChannelId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("GuildConfigData", GuildDataSchema);
