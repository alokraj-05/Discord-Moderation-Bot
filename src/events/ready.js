const { Events } = require("discord.js");
const { getPrefix } = require("../prefix/getPrefix");
const Status = require("../models/status");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    const allGuilds = client.guilds.cache.map((guild) => guild.id);
    if (!allGuilds.length) {
      console.log("The bot is not in any guilds.");
      return;
    }
    const savedStatus = await Status.findOne({});

    const status = savedStatus ? savedStatus.status : "S!";
    const activityType = savedStatus ? savedStatus.activityType : 2;

    client.user.setPresence({
      activities: [{ name: `${status}`, type: activityType }], // type 2 sets it as "Listening to"
      status: "online", // Optional: You can set the bot's status to 'online', 'idle', 'dnd', or 'invisible'
    });
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
