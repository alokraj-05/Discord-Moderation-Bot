const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("About the server"),
  async execute(interaction) {
    const { guild } = interaction;

    // Fetch server information
    const serverName = guild.name;
    const memberCount = guild.memberCount;
    const createdAt = `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`;
    const boostCount = guild.premiumSubscriptionCount || 0;
    const boostTier = guild.premiumTier ? `Tier ${guild.premiumTier}` : "None";
    const totalRoles = guild.roles.cache.size;
    const totalChannels = guild.channels.cache.size;
    const owner = await guild.fetchOwner();

    // Create an embed with the server's details
    const serverInfoEmbed = new EmbedBuilder()
      .setColor(0x3498db) // Customize the color
      .setTitle(`Server Information: ${serverName}`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: "Server Owner", value: owner.user.tag, inline: true },
        { name: "Member Count", value: memberCount.toString(), inline: true },
        { name: "Boost Count", value: boostCount.toString(), inline: true },
        { name: "Boost Tier", value: boostTier, inline: true },
        { name: "Total Roles", value: totalRoles.toString(), inline: true },
        {
          name: "Total Channels",
          value: totalChannels.toString(),
          inline: true,
        },
        { name: "Created On", value: createdAt, inline: true },
        { name: "Server ID", value: guild.id, inline: true }
      )
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    // Send the embed
    await interaction.reply({ embeds: [serverInfoEmbed] });
  },
};
