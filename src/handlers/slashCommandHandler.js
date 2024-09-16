const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");

module.exports = (client) => {
  client.slashCommands = new Collection();
  const commandFiles = fs
    .readdirSync(path.join(__dirname, "../commands/utility"))
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`../commands/utility/${file}`);
    client.slashCommands.set(command.data.name, command);
  }

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error executing that command.",
        ephemeral: true,
      });
    }
  });
};
