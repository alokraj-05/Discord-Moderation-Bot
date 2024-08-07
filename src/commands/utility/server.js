const { SlashCommandBuilder } = require("discord.js");
const { execute } = require("./ping");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("About the server"),
  async execute(interaction) {
    await interaction.reply(
      `This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members`
    );
  },
};
