const { EmbedBuilder } = require("discord.js");

class Alert {
  constructor(interaction) {
    this.interaction = interaction;
  }
  async errorAlert(message) {
    const alertEmbed = new EmbedBuilder()
      .setDescription(message)
      .setColor("Red");
    const sendEmbed = await this.interaction.reply({
      embeds: [alertEmbed],
      ephemeral: true,
    });
    setTimeout(() => {
      sendEmbed.delete();
    }, 10000);
  }
  async errorAlertWithTitle(message, errTitle) {
    const alertEmbed = new EmbedBuilder()
      .setTitle(errTitle)
      .setDescription(message)
      .setColor("Red");
    const sendEmbed = await this.interaction.reply({
      embeds: [alertEmbed],
      ephemeral: true,
    });
    setTimeout(() => {
      sendEmbed.delete();
    }, 10000);
  }

  async successAlert(message) {
    const alertEmbed = new EmbedBuilder()
      .setDescription(message)
      .setColor("Blurple");
    const sendEmbed = await this.interaction.reply({
      embeds: [alertEmbed],
      ephemeral: true,
    });
    setTimeout(() => {
      sendEmbed.delete();
    }, 10000);
  }
  async successAlertWithTitle(message, successTitle) {
    const alertEmbed = new EmbedBuilder()
      .setTitle(successTitle)
      .setDescription(message)
      .setColor("Blurple");

    await this.interaction.reply({ embeds: [alertEmbed], ephemeral: true });
  }
}

module.exports = Alert;
