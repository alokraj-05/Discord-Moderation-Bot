const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setwords")
    .setDescription("Set inappropriate words")
    .addStringOption((option) =>
      option
        .setName("words")
        .setDescription("Comma-separated list of inappropriate words")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has("ADMINISTRATOR")) {
      return interaction.reply({
        content: "You don't have permission to use this command.",
        ephemeral: true,
      });
    }

    const words = interaction.options
      .getString("words")
      .split(",")
      .map((word) => word.trim());

    const dataPath = path.join(__dirname, "../../data/inappropriateWords.json");
    fs.writeFileSync(dataPath, JSON.stringify(words, null, 2));

    await interaction.reply({
      content: "Inappropriate words have been updated.",
      ephemeral: true,
    });
  },
};
