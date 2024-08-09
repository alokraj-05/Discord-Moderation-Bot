const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a user for using inappropriate words")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to timeout")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("duration")
        .setDescription("Duration of the timeout in minutes")
        .setRequired(true)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const duration = interaction.options.getInteger("duration") * 60 * 1000;

    const member = await interaction.guild.members.fetch(user.id);
    await member.timeout(duration, "Used inappropriate language");

    await interaction.reply({
      content: `${user.tag} has been timed out for ${
        duration / 60000
      } minutes.`,
      ephemeral: true,
    });
  },
};
