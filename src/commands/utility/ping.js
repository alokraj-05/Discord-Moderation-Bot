const {
  SlashCommandBuilder,
  Client,
  GatewayIntentBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Show the user ping"),
  async execute(interaction) {
    const sentMessage = await interaction.reply({
      content: "Calculating ping...",
      fetchReply: true,
    });

    const userPing =
      sentMessage.createdTimestamp - interaction.createdTimestamp;
    const apiPing = Math.round(interaction.client.ws.ping);

    const pingEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Pong! 🏓")
      .setDescription(
        `Your ping is: **${userPing}ms**\nAPI ping: **${apiPing}ms**`
      )
      .setTimestamp();

    await interaction.editReply({ content: "", embeds: [pingEmbed] });
  },
};
