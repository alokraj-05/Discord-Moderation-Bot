const { EmbedBuilder } = require("discord.js");
require("dotenv").config();
const UserPermissions = require("../../models/userPermissions");
const GuildConfigData = require("../../models/fetchGuild");
module.exports = {
  name: "notice",
  description: "Make an announcement only for bot owner and special users.",
  async execute(client, message, args) {
    async function failedEmbed(msg) {
      const failedmsgEmbed = new EmbedBuilder()
        .setDescription(msg)
        .setColor("Red")
        .setTimestamp();
      const failedMesage = await message.reply({ embeds: [failedmsgEmbed] });
      setTimeout(() => {
        failedMesage.delete().catch((err) => console.error(err));
      }, 5000);
    }
    async function successEmbed(msg) {
      const successmsgEmbed = new EmbedBuilder()
        .setDescription(msg)
        .setColor("Blurple")
        .setTimestamp()
        .setTitle("Announcement");
      await message.channel.send({ embeds: [successmsgEmbed] });
    }

    const owner = process.env.BOT_OWNER_ID;
    const executor = message.author.id;
    const specialUser = await UserPermissions.findOne({ userId: executor });
    const announcement = args.slice(0).join(" ");
    if (executor !== owner && !specialUser) {
      return await failedEmbed(
        `Only user or selected people's can make announcement for the bot.`
      );
    }
    if (!announcement)
      return await failedEmbed(`Please provide an announcement message.`);

    const allGuild = await client.guilds.cache.map((guild) => guild);
    for (const guild of allGuild) {
      try {
        const guildConfig = await GuildConfigData.findOne({
          guildId: guild.id,
        });

        let announcementChannel = guild.channels.cache.find(
          (channel) => channel.type === 5
        );
        if (!announcementChannel) {
          console.log(`No announcement channel found in guild ${guild.name}`);
          continue;
        }
        const announcementEmbed = new EmbedBuilder()
          .setTitle("Announcement")
          .setDescription(announcement)
          .setColor("Blurple")
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

        await announcementChannel.send({ embeds: [announcementEmbed] });
        console.log(`Announcement posted in guild: ${guild.name}`);
        await successEmbed(`Announcement posted.`);
      } catch (error) {
        console.error(
          `Failed to post announcement in guild ${guild.name}:`,
          error
        );
      }
    }
  },
};
