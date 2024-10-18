const commandHandler = require("./slashCommandHandler");

module.exports = (client) => {
  client.on("messageCreate", (message) => commandHandler(client, message));
  client.on("interactionCreate", (interaction) =>
    commandHandler(client, interaction)
  );
};
