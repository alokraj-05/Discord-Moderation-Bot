const { fetchAndSaveGuildData } = require("./FetchGuilds");

module.exports = {
  name: "guildCreate",
  async execute(guild) {
    console.log(`Joined a new guild: ${guild.name} (ID: ${guild.id})`);

    // Fetch and save data for the new guild
    await fetchAndSaveGuildData(guild);
  },
};
