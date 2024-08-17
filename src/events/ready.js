const { Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    client.user.setPresence({
      activities: [{ name: "help/aboutsergio", type: 2 }], // type 2 sets it as "Listening to"
      status: "online", // Optional: You can set the bot's status to 'online', 'idle', 'dnd', or 'invisible'
    });
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
