const { EmbedBuilder } = require("discord.js");
const { execute } = require("./inappropriateWords");

module.exports = {
  name: "av",
  description: "Get server avatar of user",
  async execute(message, args) {
    async function failedEmbed(msg) {
      const failedEmbedEmbed = new EmbedBuilder().setDescription(msg);
      const failedEmbedMsg = await message.send({ embeds: [failedEmbedEmbed] });
      setTimeout(() => {
        failedEmbedMsg.delete();
      }, 10_000);
    }
    if (message.author.bot) return;
    const executorAV = message.member;
    const targetUser = message.mentions.members.first();
    if (!targetUser) return failedEmbed(`Who gonna mention a user ?`);
    const avUrl =
      targetUser.avatarURL({ dynamic: true, size: 512 }) ||
      targetUser.user.avatarURL({ dynamic: true, size: 512 });
    if (!avUrl)
      return failedEmbed(`The user does not have a server-specific avatar.`);
    try {
      const successEmbed = new EmbedBuilder()
        .setAuthor({
          name: "executor",
          iconURL: `${executorAV.displayAvatarURL()}`,
        })
        .setImage(avUrl)
        .setDescription(`[Download](${avUrl})`)
        .setColor("#002540");
      return message.channel.send({ embeds: [successEmbed] });
    } catch (error) {
      console.error(`An error occured while loading server avatar: ${error}`);
    }
  },
};
