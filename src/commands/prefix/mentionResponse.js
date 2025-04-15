const { EmbedBuilder } = require("discord.js");
const { getPrefix } = require("../../prefix/getPrefix"); // Assuming this is the correct path to fetch prefix

module.exports = {
  name: "mentionResponse",
  async execute(message, client) {
    if (
      message.author.bot ||
      message.system ||
      !message.mentions.has(client.user)
    )
      return;
    botMention = message.mentions.users.has(client.user.id);
    firstMention = message.mentions.members.first();

    if (firstMention && firstMention.id === client.user.id) {
      const prefix = await getPrefix(message.guild.id);
      const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setDescription(
          `<:3433mipinch:1284932155574714388> Please use my commands with \`${prefix}help\` or use /about to get about me || [documentation](https://sergio-ten.vercel.app/).`
        )
        .setFooter({ text: `Prefix for this server: ${prefix}` });
      return message.reply({ embeds: [embed] });
    }
  },
};
