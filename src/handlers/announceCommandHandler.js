const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");
const { getPrefix } = require("../prefix/getPrefix");

module.exports = (client) => {
  client.announcementCommands = new Collection();
  const commandFiles = fs
    .readdirSync(path.join(__dirname, "../commands/announcement"))
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`../commands/announcement/${file}`);
    client.announcementCommands.set(command.name, command);
  }

  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    const prefix = (await getPrefix(message.guild.id)) || "S!";
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.announcementCommands.get(commandName);
    if (!command) return;

    client.on("messageCreate", async (message) => {
      if (message.author.bot) return;

      const prefix = await getPrefix(message.guild.id); // Fetch the custom prefix

      if (!message.content.startsWith(prefix)) return;

      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();

      if (commandName === "announcement") {
        const command = client.commands.get("announcement");
        if (command) {
          command.execute(message, args);
        }
      }
    });

    try {
      await command.execute(client, message, args);
    } catch (error) {
      console.error(error);
      message.reply("There was an error executing that command.");
    }
  });
};
