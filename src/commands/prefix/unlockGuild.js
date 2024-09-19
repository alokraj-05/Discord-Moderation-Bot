const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "unlock",
  description: "Unlock the guild",
  async execute(message) {
    const executor = message.member;
    if (
      !executor.permissions.has(PermissionsBitField.Flags.ManageChannels) ||
      !executor.permissions.has(PermissionsBitField.Flags.Administrator)
    ) {
      const noPermsEmbed = new EmbedBuilder().setDescription(
        `You don't have enough perms to overwrite channels permissions, please ask any admin to make changes.`
      );
      return message.reply({ embeds: [noPermsEmbed] });
    }
    try {
      const embed = new EmbedBuilder()
        .setColor("#00ff00")
        .setTitle("<a:32877animatedarrowbluelite:1284206601389215887> Unlocked")
        .setDescription(
          `<:2933mitouch:1284932250605060177> The channel ${message.channel} has been unlocked.`
        );
      await message.channel.permissionOverwrites.set([
        {
          id: message.guild.roles.everyone,
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
      ]);
      await message.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      const erorrEmbed = new EmbedBuilder().setDescription(
        "An error occurred while executing this command"
      );
      message.reply({ embeds: [erorrEmbed] });
    }
  },
};
