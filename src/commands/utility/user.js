const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Show user information")
    .addUserOption((option) =>
      option.setName("target").setDescription("Select a user").setRequired(true)
    ),
  async execute(interaction) {
    const targetUser =
      interaction.options.getUser("target") || interaction.user;
    const targetMember = interaction.guild.members.cache.get(targetUser.id);

    const userInfoEmbed = new EmbedBuilder()
      .setColor(0x1abc9c)
      .setTitle(`User Information: ${targetUser.tag}`)
      .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "Username", value: targetUser.tag, inline: true },
        { name: "ID", value: targetUser.id, inline: true },
        {
          name: "Joined Server On",
          value: targetMember
            ? `<t:${Math.floor(targetMember.joinedTimestamp / 1000)}:F>`
            : "N/A",
          inline: true,
        },
        {
          name: "Joined Discord On",
          value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:F>`,
          inline: true,
        },
        {
          name: "Member Status",
          value: targetMember?.pending ? "Pending" : "Verified",
          inline: true,
        },
        {
          name: "Server Booster",
          value: targetMember?.premiumSince
            ? `Yes, since <t:${Math.floor(
                targetMember.premiumSinceTimestamp / 1000
              )}:R>`
            : "No",
          inline: true,
        }
      )
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();
    await interaction.reply({ embeds: [userInfoEmbed] });
  },
};
