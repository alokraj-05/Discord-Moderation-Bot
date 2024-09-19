const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("change-nick")
    .setDescription("Chnage nickname for the user")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Enter the target username.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("nickname")
        .setDescription("Enter the nickname for the user.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const nickname = interaction.options.getString("nickname");
    const member = interaction.guild.members.cache.get(user.id);

    if (
      !interaction.guild.members.me.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      interaction.followUp({
        content: `I don't have permission to change nickname.`,
        ephemeral: true,
      });
    }

    if (
      !interaction.member.permissions.has(
        PermissionFlagsBits.ManageNicknames
      ) &&
      !interaction.member.permissions.has(PermissionFlagsBits.Administrator)
    ) {
      interaction.followUp({
        content: `You don't have permission to change nickname for the user.`,
      });
    }

    // if (!member.manageable) {
    //   return interaction.reply({
    //     content:
    //       "I cannot change the nickname of this member. They might have higher roles than me or have administrator permissions.",
    //     ephemeral: true,
    //   });
    // }

    try {
      await member.setNickname(
        nickname,
        `Nickname changed by ${interaction.user.tag}`
      );
      const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle("✅ Nickname changed successfully")
        .setDescription(
          `${user.tag}'s nickname has been changed to **${nickname}**.`
        )
        .setFooter({
          text: `Changed by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp();
      await interaction.reply({
        embeds: [embed],
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error trying to change the nickname.",
        ephemeral: true,
      });
    }
  },
};
