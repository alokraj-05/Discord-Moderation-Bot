const {
  SlashCommandBuilder,
  PermissionsBitField,
  Permissions,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a memeber from the user")
    .addUserOption((option) =>
      option.setName("user").setDescription("User has to ban").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Please provide an appropriate reason")
        .setRequired(true)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const member = interaction.guild.members.cache.get(user.id);
    const reason = interaction.options.getString("reason");
    if (
      !interaction.guild.members.me.permissions.has(
        PermissionsBitField.Flags.BanMembers
      )
    ) {
      return interaction.reply({
        content: `I don't have permission to ban a user`,
        ephemeral: true,
      });
    }
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
    ) {
      return interaction.reply({
        content: `You don't have permission to ban a user`,
        ephemeral: true,
      });
    }
    if (!member.bannable) {
      return interaction.reply({
        content: `I cannot ban this member. They might have higher roles than me or administrator permissions.`,
        ephemeral: true,
      });
    }

    await member.ban({
      reason: `Banned by ${interaction.user.tag} for ${reason}`,
    });

    await interaction.reply({ content: `${user.tag} has been banned` });
  },
};
