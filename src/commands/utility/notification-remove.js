const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");
const NotificationConfig = require("../../models/notificationConfig");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("yt-notification-remove")
    .setDescription("Remove youtube notifications embed")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((option) =>
      option
        .setName("youtube-id")
        .setDescription("The ID of the target youtube channel")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("target-channel")
        .setDescription("The target channel to turn off notifications")
        .addChannelTypes(ChannelType.GuildAnnouncement, ChannelType.GuildText)
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });

      const targetYtChannelId = interaction.options.getString("youtube-id");
      const targetChannelId = interaction.options.getChannel("target-channel");

      const targetChannel = await NotificationConfig.findOne({
        ytChannelId: targetYtChannelId,
        notificationChannelId: targetChannelId.id,
      });

      if (!targetChannel) {
        interaction.followUp(
          "That youtube channel has not configured for notifications."
        );
        return;
      }
      const embed = new EmbedBuilder()
        .setDescription(
          `Turned off notifications for ${targetChannelId} channel.`
        )
        .setColor("Blue")
        .setFooter({
          text: `Requested by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      NotificationConfig.findOneAndDelete({ _id: targetChannel._id })
        .then(() => {
          interaction.followUp({ embeds: [embed] });
        })
        .catch((e) => {
          interaction.followUp(
            "There was a databse error. Please try again in a while."
          );
        });
    } catch (error) {
      console.log(error);
    }
  },
};
