const AfkModal = require("../models/afk");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "remove-afk",
  description: "Removes afk for an user",

  async execute(client) {
    client.on("messageCreate", async (message) => {
      async function RemovedAFKEmbed(msg, username) {
        const removeEmbed = new EmbedBuilder()
          .setTitle(
            `<:93235smilingoctopus:1292732867381563404> Afk removed, Welcome back ${username}`
          )
          .setDescription(msg)
          .setTimestamp()
          .setColor("Blue");
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
          .setTitle(
            `<:1137kissoctopus:1292732821055737867> ${username} is currently afk!`
          )
          .setDescription(
            `<:98683octopus:1292732890244972554> They have been Afk since: <:event_badge:1292734443852795945>\` ${afkSince} \`\n<a:73288animatedarrowred:1284206642816352386> reason: **${reason}**`
          )
          .setColor("Red")
          .setTimestamp();
        const MentionMessage = await message.reply({ embeds: [MentionEmbed] });
        setTimeout(() => {
          MentionMessage.delete().catch((err) =>
            console.error(`Failed to delete AFK embed: ${err}`)
          );
        }, 30 * 1000);
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
        await RemovedAFKEmbed(
          `<a:32877animatedarrowbluelite:1284206601389215887> Your Afk status has been removed.`,
          afkusername
        );
      }
      const mentionedUsers = message.mentions.users;

      for (const [mentionedUserId, mentionedUser] of mentionedUsers) {
        const afkUser = await AfkModal.findOne({
          userId: mentionedUserId,
          guildId: guildId,
        });

        const username = mentionedUser.username;
        if (afkUser) {
          const afkSince = new Date(afkUser.afkTimeStamp).toLocaleString();
          const afkreason = afkUser.AfkReason;
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
