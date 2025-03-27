const { ChannelType, PermissionsBitField } = require("discord.js");
const { fetchAndSaveGuildData } = require("./FetchGuilds");
const { PermissionOverwrites } = require("discord.js");

module.exports = {
  name: "guildCreate",
  async execute(guild) {
    console.log(`Joined a new guild: ${guild.name} (ID: ${guild.id})`);

    // Fetch and save data for the new guild
    await fetchAndSaveGuildData(guild);

    try {
      const sergioUpdates = await guild.channels.create({
        name: "sergio-updates",
        type: 4,
      });
      const isCommunity = guild.features.includes("COMMUNITY");
      if (isCommunity) {
        await guild.channels.create({
          name: "sergio-announcements",
          parent: sergioUpdates.id,
          type: 5,
          permissionOverwrites: [
            {
              id: guild.roles.everyone.id,
              deny: [PermissionsBitField.Flags.SendMessages],
            },
          ],
        });
      } else {
        await guild.channels.create({
          name: "sergio-announcements",
          parent: sergioUpdates.id,
          type: 0,
          permissionOverwrites: [
            {
              id: guild.roles.everyone.id,
              deny: [PermissionsBitField.Flags.SendMessages],
            },
          ],
        });
      }
    } catch (error) {
      console.error(`Error while setting up new category ${error.message}`);
    }
  },
};
