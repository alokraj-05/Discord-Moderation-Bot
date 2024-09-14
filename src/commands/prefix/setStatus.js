const { EmbedBuilder } = require("discord.js");
const Status = require("../../models/status");
require("dotenv").config();

module.exports = {
  name: "cs",
  description: "Set status for the bot",
  async execute(message, args) {
    try {
      const botOwnerId = process.env.BOT_OWNER_ID;
      const memberId = message.author.id;
      const activityType = parseInt(args[0], 10);
      const newStatus = args.slice(1).join(" ");

      const memberEmbed = new EmbedBuilder().setDescription(
        "Only bot's Owner is supposed to change the bot status."
      );

      if (memberId != botOwnerId) {
        return message.reply({ embeds: [memberEmbed] });
      }

      if (args.length < 2) {
        const errorEmbed = new EmbedBuilder().setDescription(
          "Please provide both an activity type and a status message."
        );
        return message.reply({ embeds: [errorEmbed] });
      }
      if (isNaN(activityType) || activityType < 0 || activityType > 5) {
        const invalidTypeEmbed = new EmbedBuilder().setDescription(
          "Invalid activity type. Please provide a type between 0 and 5."
        );
        return message.reply({ embeds: [invalidTypeEmbed] });
      }

      await Status.findOneAndUpdate(
        {},
        { status: newStatus, activityType: activityType },
        { upsert: true }
      );

      message.client.user.setPresence({
        activities: [{ name: newStatus, type: activityType }],
        status: "online",
      });

      const successEmbed = new EmbedBuilder()
        .setDescription(
          `Successfully updated the bot status to: **${newStatus}**`
        )
        .setColor("Blue");
      return message.reply({ embeds: [successEmbed] });
    } catch (error) {
      const errorEmbed = new EmbedBuilder().setDescription(
        "An error occurred while setting the status."
      );
      console.error(error);
      return message.reply({ embeds: [errorEmbed] });
    }
  },
};
