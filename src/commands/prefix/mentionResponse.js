const { EmbedBuilder } = require('discord.js');
const { getPrefix } = require('../../prefix/getPrefix'); // Assuming this is the correct path to fetch prefix

module.exports = {
  name: 'mentionResponse',
  async execute(message, client) {
    if (message.author.bot || message.system) return;

    if (message.mentions.has(client.user)) {
      const prefix = await getPrefix(message.guild.id);

      // Create an embed response
      const embed = new EmbedBuilder()
        .setColor('Blurple')
        .setDescription(`<:3433mipinch:1284932155574714388> Please use my commands with \`${prefix}help\` or use /about to get about me || [documentation](https://sergio-docs.vercel.app/).`)
        .setFooter({ text: `Prefix for this server: ${prefix}` });

      // Send the embed in the same channel
      return message.reply({ embeds: [embed] });
    }
  },
};
