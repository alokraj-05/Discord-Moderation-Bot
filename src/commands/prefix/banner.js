const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "banner",
  description: "Get user banner",
  async execute(message) {
    async function failedEmbed(msg) {
      const failedEmbedEmbed = new EmbedBuilder().setDescription(msg);
      const failedEmbedMsg = await message.channel.send({
        embeds: [failedEmbedEmbed],
      });
      setTimeout(() => {
        failedEmbedMsg.delete();
      }, 10_000);
    }
    if (message.author.bot) return;

    const targetUser = message.mentions.users.first();
    if (!targetUser) return failedEmbed(`Mention a user!`);
    try {
      const user = await targetUser.fetch();
      const banner = user.bannerURL({ dynamic: true, size: 512 });
      if (!banner) return failedEmbed(`User don't have any banner.`);

      const successEmbed = new EmbedBuilder()
        .setImage(banner)
        .setDescription(`[Download](${banner})`);
      return message.channel.send({ embeds: [successEmbed] });
    } catch (error) {
      console.log(error);
      failedEmbed(`An error occured while executing the cmd.`);
    }
  },
};
