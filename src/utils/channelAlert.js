const { EmbedBuilder } = require("discord.js");

class ChannelAlert {
  constructor(channel) {
    this.channel = channel;
  }

  async dangerAlert(message) {
    const embed = new EmbedBuilder().setDescription(message).setColor("Red");
    await this.channel.send({ embeds: [embed] });
  }

  async successAlert(message) {
    const embed = new EmbedBuilder()
      .setDescription(message)
      .setColor("Blurple");
    await this.channel.send({ embeds: [embed] });
  }
}

module.exports = ChannelAlert;
