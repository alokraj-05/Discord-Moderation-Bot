const {
  PermissionsBitField,
  EmbedAssertions,
  EmbedBuilder,
} = require("discord.js");
module.exports = {
  name: "prefix",
  description: "Set a custom prefix for the server",
  async execute(message, args) {
    const executor = message.member;
    if (!executor.permissions.has(PermissionsBitField.Flags.Administrator)) {
      const noPermsEmbed = new EmbedBuilder().setDescription(
        "<:17927warning:1284208753339793408> You do not have enough permissions to ban a member."
      );
      return message.reply({ embeds: [noPermsEmbed] });
    }
    const newPrefix = args[0];
    if (!newPrefix) return message.reply("Please provide a new prefix.");

    const { setPrefix } = require("../../prefix/setPrefix");
    await setPrefix(message.guild.id, newPrefix);
    const successEmbed = new EmbedBuilder()
      .setDescription(
        `<a:32877animatedarrowbluelite:1284206601389215887> Prefix set to ${newPrefix}`
      )
      .setTitle(`<:52714verified:1284208131525705828> Prefix updated`)
      .setColor("Blue");
    message.reply({ embeds: [successEmbed] });
  },
};
