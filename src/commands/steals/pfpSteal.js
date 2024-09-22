const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  Component,
} = require("discord.js");
const { execute } = require("../prefix/embed");

module.exports = {
  name: "pfp",
  descripition: "Get the pfp of any user",
  async execute(message, args) {
    async function failedEmbed(msg) {
      const failedmsgEmbed = new EmbedBuilder()
        .setDescription(msg)
        .setColor("Red")
        .setTimestamp();
      const failedMesage = await message.reply({ embeds: [failedmsgEmbed] });
      setTimeout(() => {
        failedMesage.delete().catch((err) => console.error(err));
      }, 5000);
    }
    async function successEmbed(pfp, userTag) {
      const successmsgEmbed = new EmbedBuilder()
        .setTitle(`${userTag}'s profile picutre`)
        .setImage(pfp)
        .setColor("Blurple")
        .setTimestamp();
      const Buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Download")
          .setURL(pfp)
          .setStyle(ButtonStyle.Link)
      );

      await message.reply({ embeds: [successmsgEmbed], components: [Buttons] });
    }
    const pfpUsername = message.mentions.users.first();
    if (!pfpUsername) {
      return await failedEmbed(`Please mention a user to get there pfp.`);
    }
    const pfpUrl = pfpUsername.displayAvatarURL({ dynamic: true, size: 512 });
    const userTag = pfpUsername.tag;
    await successEmbed(pfpUrl, userTag);
  },
};
