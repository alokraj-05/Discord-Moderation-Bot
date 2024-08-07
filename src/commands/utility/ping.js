const { SlashCommandBuilder, Co } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Show the user ping"),
  async execute(interaction) {
    await interaction.reply("pong!");
  },
};
