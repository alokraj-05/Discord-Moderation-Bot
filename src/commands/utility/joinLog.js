const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");
const GuildSettings = require("../../models/guildSettings"); // Import the schema

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setwelcomechannel")
    .setDescription("Sets a channel for notifications when new members join.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to send notifications to")
        .setRequired(true)
    ),
  async execute(interaction) {
    const { member, guild } = interaction;

    const notPermEmbed = new EmbedBuilder().setDescription(
      "You do not have permission to set the welcome channel."
    );
    // Check if the user has permission to manage the server
    if (!member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return await interaction.reply({ embeds: [notPermEmbed] });
    }

    const channel = interaction.options.getChannel("channel");
    const channelId = interaction.options.getChannel("channel").id;
    const existingGuild = await GuildSettings.findOne({ guildId: guild.id });
    if (existingGuild) {
      if (existingGuild.welcomeChannelId === channelId) {
        const channelConfiguredEmbed = new EmbedBuilder().setDescription(
          `This channel ${channel} has already been configured as the welcome channel.`
        );
        return interaction.reply({ embeds: [channelConfiguredEmbed] });
      } else {
        existingGuild.welcomeChannelId = channelId;
        await existingGuild.save();

        const channelUpdatedEmbed = new EmbedBuilder().setDescription(
          `The channel ${channel} has been updated for welcome message successfully.`
        );
        return interaction.reply({ embeds: [channelUpdatedEmbed] });
      }
    } else {
      try {
        // Update or create the guild settings in the database
        await GuildSettings.findOneAndUpdate(
          { guildId: guild.id },
          { welcomeChannelId: channel.id },
          { upsert: true, new: true }
        );

        const successEmbed = new EmbedBuilder()
          .setDescription(
            `The welcome notifications channel has been set to ${channel}.`
          )
          .setColor("Blue");

        await interaction.reply({ embeds: [successEmbed] });
      } catch (error) {
        console.error("Error saving welcome channel:", error);
        await interaction.reply(
          "There was an error setting the welcome channel."
        );
      }
    }
  },
};
