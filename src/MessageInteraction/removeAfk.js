const AfkModal = require("../models/afk");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "remove-afk",
  description: "Removes afk for an user",

  async execute(client) {
    client.on("messageCreate", async (message) => {
      async function RemovedAFKEmbed(msg, username) {
        const removeEmbed = new EmbedBuilder()
          .setTitle(`Afk removed, Welcome back ${username}`)
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
      async function MentionMsgEmbed(username, afkSince) {
        const MentionEmbed = new EmbedBuilder()
          .setTitle(`${username} is currently afk!`)
          .setDescription(`They have been Afk since: \`${afkSince}\``)
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
        await RemovedAFKEmbed(`Your Afk status has been removed.`, afkusername);
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

          await MentionMsgEmbed(username, afkSince);

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
