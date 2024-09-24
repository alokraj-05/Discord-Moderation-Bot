const GuildConfigData = require("../models/fetchGuild");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`${client.user.tag} Fetching all guilds... `);

    client.guilds.cache.forEach(async (guild) => {
      await fetchAndSaveGuildData(guild);
    });
  },
};

async function fetchAndSaveGuildData(guild) {
  try {
    const guildData = {};

    // Fetch guild information
    const owner = await guild.fetchOwner();
    const roles = guild.roles.cache;
    const channels = guild.channels.cache;

    // Calculate total number of text and voice channels
    const totalTextChannels = channels.filter(
      (channel) => channel.type === 0
    ).size;
    const totalVoiceChannels = channels.filter(
      (channel) => channel.type === 2
    ).size;

    // Get the highest role by position
    const highestRole = roles.reduce((prev, curr) =>
      prev.position > curr.position ? prev : curr
    );

    // Prepare the guild data
    guildData.guildId = guild.id;
    guildData.guildName = guild.name;
    guildData.guildOwnerId = owner.id;
    guildData.guildOwnerName = owner.user.username;
    guildData.totalRoles = roles.size;
    guildData.roleIds = roles.map((role) => role.id); // Array of role IDs
    guildData.guildCreatedDate = guild.createdAt;
    guildData.boostCount = guild.premiumSubscriptionCount;
    guildData.guildBoostLevel = guild.premiumTier;
    guildData.totalTextChannels = totalTextChannels;
    guildData.textChannelIds = channels
      .filter((channel) => channel.type === 0)
      .map((channel) => channel.id);
    guildData.totalVoiceChannels = totalVoiceChannels;
    guildData.voiceChannelIds = channels
      .filter((channel) => channel.type === 2)
      .map((channel) => channel.id);
    guildData.highestRole = highestRole.name;
    guildData.highestRoleId = highestRole.id;
    guildData.memberCount = guild.memberCount;

    await guild.members.fetch(); // Fetch all members
    const onlineMemberCount = guild.members.cache.filter(
      (member) => member.presence?.status === "online"
    ).size;
    guildData.onlineMemberCount = onlineMemberCount;
    const announcementsChannel = guild.channels.cache.find(
      (channel) => channel.type === 5
    );
    guildData.announcementsChannelId = announcementsChannel
      ? announcementsChannel.id
      : null;

    guildData.afkChannelId = guild.afkChannelId;
    guildData.afkChannelName = guild.afkChannel ? guild.afkChannel.name : null;
    guildData.afkTimeout = guild.afkTimeout;
    guildData.verificationLevel = guild.verificationLevel;
    guildData.explicitContentFilter = guild.explicitContentFilter;
    guildData.defaultMessageNotifications = guild.defaultMessageNotifications;
    guildData.mfaLevel = guild.mfaLevel;
    guildData.systemChannelId = guild.systemChannelId;
    guildData.systemChannelName = guild.systemChannel
      ? guild.systemChannel.name
      : null;
    guildData.features = guild.features;
    guildData.region = guild.region || "deprecated";
    guildData.locale = guild.preferredLocale;
    guildData.boostTier = guild.premiumTier;
    guildData.boostingMembersCount = guild.premiumSubscriptionCount;
    guildData.bannerURL = guild.bannerURL();
    guildData.iconURL = guild.iconURL();
    guildData.rulesChannelId = guild.rulesChannelId;
    guildData.rulesChannelName = guild.rulesChannel
      ? guild.rulesChannel.name
      : null;
    guildData.description = guild.description;

    // Save or update the guild data in the database
    await GuildConfigData.findOneAndUpdate({ guildId: guild.id }, guildData, {
      upsert: true,
      new: true,
    });

    console.log(`Data for guild ${guild.name} has been saved.`);
  } catch (error) {
    console.error(`Error fetching data for guild ${guild.id}: ${error}`);
  }
}

module.exports.fetchAndSaveGuildData = fetchAndSaveGuildData;
