const { SlashCommandBuilder } = require("discord.js");
const { execute } = require("../../mod/moderation/ban");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Show the user ping"),
  async execute(interaction) {
    await interaction.reply("pong!");
  },
};
