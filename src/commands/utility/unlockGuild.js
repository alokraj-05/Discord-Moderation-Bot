const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Unlock the current channel."),
  async execute(interaction) {
    const { channel, member, guild } = interaction;

    // Check if the bot has Administrator permission
    if (
      !guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)
    ) {
      await interaction.reply(
        "I don't have permission to change the channel settings."
      );
      return;
    }

    // Check if the member has Manage Channels permission
    if (member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      try {
        // Set permission to make the channel public
        await channel.permissionOverwrites.set([
          {
            id: guild.roles.everyone, // Everyone role
            allow: [PermissionsBitField.Flags.ViewChannel], // Allow viewing channel
          },
        ]);

        await interaction.reply(
          `Your channel *${channel.name}* is now public.`
        );
      } catch (error) {
        console.error("Error unlocking the channel:", error);
        await interaction.reply(
          "An error occurred while trying to unlock the channel."
        );
      }
    } else {
      await interaction.reply(
        "You don't have permission to change the channel settings."
      );
    }
  },
};
