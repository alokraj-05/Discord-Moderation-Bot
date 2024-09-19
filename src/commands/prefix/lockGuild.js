const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "lock",
  description: "Lock the channel",
  async execute(message) {
    const executor = message.member;
    if (
      !executor.permissions.has(PermissionsBitField.Flags.ManageChannels) ||
      !executor.permissions.has(PermissionsBitField.Flags.Administrator)
    ) {
      const noPermsEmbed = new EmbedBuilder()
        .setDescription(
          `You don't have enough permissions to overwrite channels perms, please ask any higher ups.`
        )
        .setColor("Red");
      await message.reply({ embed: [noPermsEmbed], ephemeral: true });
    }

    try {
      const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle("<:92143verified:1284208031214735415> locked")
        .setDescription(
          `<:8227miheya:1284932288844660856> The channel ${message.channel} is now locked.\n perms changed: \`View channel\``
        );
      await message.channel.permissionOverwrites.set([
        {
          id: message.guild.roles.everyone,
          deny: [PermissionsBitField.Flags.ViewChannel],
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
