const { SlashCommandBuilder } = require("discord.js");
const { execute } = require("./ping");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Show user information"),
  async execute(interaction) {
    await interaction.reply(
      `Hey ${interaction.user.username}, you join this srver on ${interaction.member.joinedAt}`
    );
  },
};
