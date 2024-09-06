const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Locks the current channel, making it private."),
  async execute(interaction) {
    const { channel, member, guild } = interaction;

    if (
      !guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)
    ) {
      await interaction.reply(
        "I don't have permission to change the channel settings."
      );
      return;
    }
    if (member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      try {
        await channel.permissionOverwrites.set([
          {
            id: guild.roles.everyone,
            deny: [PermissionsBitField.Flags.ViewChannel],
            channel,
          },
        ]);

        await interaction.reply(`Your channel ${channel.name} is now private.`);
      } catch (error) {
        console.error("Error locking the channel:", error);
        await interaction.reply(
          "An error occurred while trying to lock the channel."
        );
      }
    } else {
      await interaction.reply(
        "You don't have permission to change the channel settings."
      );
    }
  },
};
