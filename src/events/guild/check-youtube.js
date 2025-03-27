const Parser = require("rss-parser");
const NotificationConfig = require("../../models/notificationConfig");

const parser = new Parser();

module.exports = (client) => {
  checkYoutube();
  setInterval(() => checkYoutube, 60_000);

  async function checkYoutube() {
    try {
      const notificationConfigs = await NotificationConfig.find();

      for (const notificationConfig of notificationConfigs) {
        const YOUTUBE_RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${notificationConfig.ytChannelId}`;

        const feed = await parser.parseURL(YOUTUBE_RSS_URL).catch((e) => null);

        if (!feed?.items.length) continue;

        const latestVideo = feed.items[0];
        const lastCheckedVid = notificationConfig.lastCheckedVid;

        if (
          !lastCheckedVid ||
          (latestVideo.id.split(":")[2] !== lastCheckedVid.id &&
            new Date(latestVideo.pubDate) > new Date(lastCheckedVid.pubDate))
        ) {
          const taregtGuild =
            client.guilds.cache.get(notificationConfig.guildId) ||
            (await client.guilds.fetch(notificationConfig.guildId));

          if (!taregtGuild) {
            await NotificationConfig.findOneAndDelete({
              _id: notificationConfig._id,
            });
            continue;
          }
          const targetChannel =
            taregtGuild.channels.cache.get(
              notificationConfig.notificationChannelId
            ) ||
            (await taregtGuild.channels.fetch(
              notificationConfig.notificationChannelId
            ));

          if (!targetChannel) {
            await NotificationConfig.findOneAndDelete({
              _id: notificationConfig._id,
            });
            continue;
          }

          notificationConfig.lastCheckedVid = {
            id: latestVideo.id.split(":")[2],
            pubDate: latestVideo.pubDate,
          };

          notificationConfig
            .save()
            .then(() => {
              const targetMessage =
                notificationConfig.customMessage
                  ?.replace("{VIDEO_URL}", latestVideo.link)
                  ?.replace("{VIDEO_TITLE}", latestVideo.title)
                  ?.replace("{CHANNEL_URL}", feed.link)
                  ?.replace("{CHANNEL_NAME}", feed.title) ||
                `New upload by ${feed.title}\n${latestVideo.link}`;

              targetChannel.send(targetMessage);
            })
            .catch((e) => null);
        }
      }
    } catch (error) {
      console.log(`Error in ${__filename}:`, error);
    }
  }
};
