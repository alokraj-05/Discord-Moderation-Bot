const AfkModal = require("../models/afk");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "remove-afk",
  description: "Removes afk for an user",

  async execute(client) {
    client.on("messageCreate", async (message) => {
      async function RemovedAFKEmbed(username) {
        const removeEmbed = new EmbedBuilder()
          .setDescription(
            `<a:51047animatedarrowwhite:1284206565334843427> Afk removed, Welcome back ${username}`
          )
          .setColor("#002540");
        const sentRemoveEmbed = await message.reply({ embeds: [removeEmbed] });
        setTimeout(() => {
          sentRemoveEmbed
            .delete()
            .catch((err) =>
              console.error(`failed to delete afk remove embed ${err.message}`)
            );
        }, 30 * 1000);
      }
      async function MentionMsgEmbed(username, afkSince, reason) {
        const MentionEmbed = new EmbedBuilder()
          .setDescription(
            `<a:73288animatedarrowred:1284206642816352386> ${username} been Afk since: \`${afkSince}\` reason: ${reason}`
          )
          .setColor("Red");
        const MentionMessage = await message.reply({ embeds: [MentionEmbed] });
        setTimeout(() => {
          MentionMessage.delete().catch((err) =>
            console.error(`Failed to delete AFK embed: ${err}`)
          );
        }, 30 * 1000);
      }
      function formateTime(ms) {
        const second = Math.floor(ms / 1000);
        const minute = Math.floor(second / 60);
        const hour = Math.floor(minute / 60);
        const days = Math.floor(hour / 24);

        if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
        if (hour > 0) return `${hour} hour${days > 1 ? "s" : ""} ago`;
        if (minute > 0) return `${minute} minute${minute > 1 ? "s" : ""} ago`;
        return `${second} second${second > 1 ? "s" : ""} ago`;
      }
      const afkusername = message.author.displayName;
      if (message.author.bot) return;

      const userId = message.author.id;
      const guildId = message.guild.id;
      const existingAfkUser = await AfkModal.findOne({
        userId: userId,
        guildId: guildId,
      });

      if (existingAfkUser) {
        await AfkModal.findOneAndDelete({ _id: existingAfkUser._id });
        await RemovedAFKEmbed(afkusername);
      }
      const mentionedUsers = message.mentions.users;

      for (const [mentionedUserId, mentionedUser] of mentionedUsers) {
        const afkUser = await AfkModal.findOne({
          userId: mentionedUserId,
          guildId: guildId,
        });

        const username = mentionedUser.username;
        if (afkUser) {
          const afkreason = afkUser.AfkReason;
          const afkTimeStamp = afkUser.afkTimeStamp;
          const currentTime = Date.now();
          const timeDifference = currentTime - afkTimeStamp;
          const afkSince = formateTime(timeDifference);
          await MentionMsgEmbed(username, afkSince, afkreason);

          afkUser.mentions.push({
            messageContent: message.content,
            mentionedBy: message.author.username,
            timestamp: new Date(),
          });
          await afkUser.save();
        }
      }
    });
  },
};
