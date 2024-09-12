const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");
const guildSettings = require("../../models/guildSettings");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove-welcome-message")
    .setDescription("Removes the welcome message")
    .addChannelOption((ch) =>
      ch
        .setName("target-channel")
        .setDescription(
          "Provide the channel from which you have to remove the welcome message."
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply({ content: "" });
      const { member, guild } = interaction;

      const targetChannelId = interaction.options.getChannel("target-channel");
      const targetGuildId = guild.id;
      const notPermEmbed = new EmbedBuilder().setDescription(
        "```You don't have enough permission to remove the welcome message.```"
      );

      if (
        !member.permissions.has(PermissionsBitField.Flags.ManageChannels) ||
        !member.permissions.has(PermissionsBitField.Flags.Administrator)
      ) {
        return await interaction.followUp({
          embeds: [notPermEmbed],
          ephemeral: true,
        });
      }

      const targetChannel = await guildSettings.findOne({
        guildId: targetGuildId,
        welcomeChannelId: targetChannelId.id,
      });
      const noChannelFoundEmbed = new EmbedBuilder().setDescription(
        "This guild or guild is not been configured for welcome messages."
      );
      if (!targetChannel)
        return interaction.followUp({ embeds: [noChannelFoundEmbed] });

      const successEmbed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(
          `Turned off welcome message notification for ${targetChannelId} channel.`
        )
        .setFooter({
          text: `Requested by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      guildSettings
        .findOneAndDelete({ _id: targetChannel._id })
        .then(() => {
          interaction.followUp({ embeds: [successEmbed] });
        })
        .catch((err) => {
          interaction.followUp(
            "There was a database error. Please try again later."
          );
        });
    } catch (error) {
      console.error(error);
      interaction.followUp("An error occured while removing the notification.");
    }
  },
};
