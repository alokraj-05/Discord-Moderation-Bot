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
    async function successEmbed(heading, title, msg, thumbnail) {
      const successmsgEmbed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(msg)
        .setThumbnail(thumbnail)
        .setColor("Blurple");
      await message.channel.send({
        content: `# ${heading}`,
        embeds: [successmsgEmbed],
      });
    }
    const prefix = await getPrefix(message.guild.id);
    const msg = args.join(" ").split("|");

    if (!msg[0]) {
      await failedEmbed(
        `Please provide a message to be sent in embed.\nFormat: \`${prefix}embed Bold Message | embed title | description | thumbnail(link)\``
      );
      return;
    } else if (msg[0] && !msg[1]) {
      await failedEmbed(
        `Please provide the rest details in embed.\nFormat: \`| embed title | description | thumbnail(link)\``
      );
      return;
    } else if (msg[0] && msg[1] && !msg[2]) {
      await failedEmbed(
        `Please provide the rest details in embed.\nFormat: \`| description | thumbnail(link)\``
      );
    } else if (msg[0] && msg[1] && msg[2] && !msg[3]) {
      await failedEmbed(
        `Please provide the rest details in embed.\nFormat: \`| thumbnail(link)\``
      );
    }
    await successEmbed(msg[0], msg[1], msg[2], msg[3]);
  },
};
