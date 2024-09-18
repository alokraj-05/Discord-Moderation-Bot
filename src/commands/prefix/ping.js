const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Replies with Pong!",
  async execute(message) {
    const sentMessage = await message.channel.send(
      "<a:Animated_Loading_3:1284206450016784394> Calculating ping..."
    );
    const userPing = sentMessage.createdTimestamp - message.createdTimestamp;
    const apiPing = Math.round(message.client.ws.ping);

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("🏓 Pong")
      .addFields(
        { name: "`Your ping is`", value: `\`${userPing}\`ms` },
        { name: "`API Ping`", value: `\`${apiPing}ms\`` }
      );
    sentMessage.edit({ content: null, embeds: [embed] });
  },
};
