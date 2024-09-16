const { SlashCommandBuilder } = require("discord.js");
const { setPrefix } = require("../../prefix/setPrefix");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setprefix")
    .setDescription("Set a custom prefix for the server")
    .addStringOption((option) =>
      option
        .setName("prefix")
        .setDescription("The new prefix")
        .setRequired(true)
    ),
  async execute(interaction) {
    const newPrefix = interaction.options.getString("prefix");
    await setPrefix(interaction.guild.id, newPrefix);
    await interaction.reply(`Prefix set to ${newPrefix}`);
  },
};
