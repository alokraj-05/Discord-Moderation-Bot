const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Commands = require("../../data/commands");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Displays all the available commands"),
  async execute(interaction) {},
};
