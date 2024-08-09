const {
  SlashCommandBuilder,
  Client,
  GatewayIntentBits,
} = require("discord.js");

module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Show the user ping"),
  async execute(interaction) {
    const client = interaction.client;
    await interaction.reply({
      content: `${client.ws.ping} ms`,
      ephemeral: true,
    });
  },
};
