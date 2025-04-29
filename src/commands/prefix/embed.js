const { EmbedBuilder } = require("discord.js");
const { getPrefix } = require("../../prefix/getPrefix");

module.exports = {
  name: "embed",
  description: "Make a message in embed",
  async execute(message, args) {
    async function failedEmbed(msg) {
      const failedmsgEmbed = new EmbedBuilder()
        .setDescription(msg)
        .setColor("Red");
      await message.reply({ embeds: [failedmsgEmbed] });
    }

    async function successEmbedDesc(msg) {
      const successmsgEmbed = new EmbedBuilder()
        .setDescription(msg)
        .setColor("Blurple");
      await message.channel.send({
        embeds: [successmsgEmbed],
      });
    }
    async function successEmbedTitle(msg, title) {
      const successmsgEmbed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(msg)
        .setColor("Blurple");
      await message.channel.send({
        embeds: [successmsgEmbed],
      });
    }

    const prefix = await getPrefix(message.guild.id);
    const msg = args.join(" ").split("|");

    if (!msg[0]) {
      await failedEmbed(`Please provide a message to be sent in embed.`);
      return;
    }
    if (msg[0] && !msg[1]) {
      return await successEmbedDesc(msg[0]);
    }
    await successEmbedTitle(msg[0], msg[1]);
  },
};
