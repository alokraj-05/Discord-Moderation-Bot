const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  Options,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");
const NotificationConfig = require("../../models/notificationConfig");
const Parser = require("rss-parser");

/** @param {import('commandkit').SlashCommandProps} param0 */
const parser = new Parser();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("yt-notifcations")
    .setDescription("Setup youtube notifications for a channel")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("youtube-id")
        .setDescription("Enter your youtube channel id")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("target-channel")
        .setDescription(
          "Enter the in which you want to log your yt notifications"
        )
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("custom-message")
        .setDescription(
          "Templates: {VIDEO_TITLE} {VIDEO_URL} {CHANNEL_NAME} {CHANNEL_URL}"
        )
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });

      const tragetYtChannelId = interaction.options.getString("youtube-id");
      const tragetChannel = interaction.options.getChannel("target-channel");
      const targetCustomMessage =
        interaction.options.getString("custom-message");

      const duplicateExist = await NotificationConfig.exists({
        notificationChannelId: tragetChannel.id,
        ytChannelId: tragetYtChannelId,
      });

      if (duplicateExist) {
        interaction.followUp(
          `That youtube channel has already been configured for that text channel.\nRun /notification-remove First.`
        );
        return;
      }

      const YOUTUBE_RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${tragetYtChannelId}`;

      const feed = await parser.parseURL(YOUTUBE_RSS_URL).catch((e) => {
        interaction.followUp(
          "There was an error while fetching the channel. Ensure the provided url is correct."
        );
      });
      if (!feed) return;

      const channelName = feed.title;

      const notificationConfig = new NotificationConfig({
        guildId: interaction.guildId,
        notificationChannelId: tragetChannel.id,
        ytChannelId: tragetYtChannelId,
        customMessage: targetCustomMessage,
        lastChecked: new Date(),
        lastCheckedVid: null,
      });
      if (feed.items.length) {
        const latestVideo = feed.items[0];

        notificationConfig.lastCheckedVid = {
          id: latestVideo.id.split(":")[2],
          pubDate: latestVideo.pubDate,
        };
      }
      notificationConfig
        .save()
        .then(() => {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle(`✅ YouTube channel Configuration Success`)
            .setDescription(
              `${tragetChannel} will now get notified whenever there's a new upload by ${channelName}.`
            )
            .setTimestamp()
            .setFooter({
              text: `Added by ${interaction.user.tag}`,
              iconURL: `${interaction.user.displayAvatarURL({
                dynamic: true,
              })}`,
            });

          interaction.followUp({ embeds: [embed] });
        })
        .catch((e) => {
          interaction.followUp(
            "An error occurred ion database please try again in a while"
          );
        });
    } catch (error) {
      console.log(`Error in: ${__filename}\n`, error);
    }
  },
};
