const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const reactionRole = require("../../models/reactionRoles");

class Embeds {
  constructor(interaction) {
    this.interaction = interaction;
  }

  async successEmbed(msg) {
    const successMsgEmbed = new EmbedBuilder()
      .setDescription(msg)
      .setColor("Blurple")
      .setTitle("Success");
    await this.interaction.editReply({
      embeds: [successMsgEmbed],
      ephemeral: true,
    });
  }

  async failedEmbed(msg) {
    const failedMsgEmbed = new EmbedBuilder()
      .setDescription(msg)
      .setColor("Red")
      .setTitle("Failed");
    await this.interaction.editReply({
      embeds: [failedMsgEmbed],
      ephemeral: true,
    });
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reaction-roles")
    .setDescription("Reaction roles for the server.")
    .addSubcommand((cmd) =>
      cmd
        .setName("setup")
        .setDescription("Setup reaction roles")
        .addChannelOption((channel) =>
          channel
            .setName("reaction-channel")
            .setDescription("Select the channel for the reaction roles")
            .setRequired(true)
        )
        .addStringOption((role) =>
          role
            .setName("roles")
            .setDescription("Provide role IDs or mentions separated by commas")
            .setRequired(true)
        )
        .addStringOption((reaction) =>
          reaction
            .setName("reactions")
            .setDescription("Provide emojis or reactions separated by commas")
            .setRequired(true)
        )
        .addStringOption((msg) =>
          msg
            .setName("custom-message")
            .setDescription("custom message for the reaction roles")
        )
    )
    .addSubcommand((cmd) =>
      cmd
        .setName("remove")
        .setDescription("remove configured reaction roles")
        .addChannelOption((channel) =>
          channel
            .setName("channel")
            .setDescription("Select the configured reaction roles channel")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const { guild } = interaction;
    const channelId = interaction.options.getChannel("reaction-channel").id;
    const guildId = guild.id;

    const sub = interaction.options.getSubcommand();
    const embedClass = new Embeds(interaction);

    switch (sub) {
      case "setup":
        try {
          await interaction.deferReply({ ephemeral: true });
          const getReactions = interaction.options.getString("reactions");
          const getRoles = interaction.options.getString("roles");
          const customMessage = interaction.options.getString("custom-message");
          const reactions = [];
          const roles = [];

          getRoles.split(",").forEach((role) => {
            const roleobj = guild.roles.cache.get(
              role.trim().replace(/[<@&>]/g, "")
            );
            if (roleobj) roles.push(roleobj.id);
          });
          getReactions.split(",").forEach((reaction) => {
            reactions.push(reaction.trim());
          });

          if (roles.length !== reactions.length) {
            return await embedClass.failedEmbed(
              "Number of roles and reactions don't match. Please ensure each reaction has a corresponding role."
            );
          }

          const channel = guild.channels.cache.get(channelId);
          const reactionRoleEmbed = new EmbedBuilder()
            .setTitle("React to get roles!")
            .setDescription(
              customMessage ||
                "React with the corresponding emoji to get a role!"
            )
            .setColor("Blurple");

          roles.forEach((role, index) => {
            reactionRoleEmbed.addFields({
              name: reactions[index],
              value: `<@${role}>`,
              inline: true,
            });
          });

          const embedMessage = await channel.send({
            embeds: [reactionRoleEmbed],
          });

          for (const reaction of reactions) {
            await embedMessage.react(reaction);
          }

          const reactionRoledb = {
            guildId: guildId,
            channelId: channelId,
            messageId: embedMessage.id,
            reactions: reactions.map((reaction, index) => ({
              reactionId: reaction,
              roleId: roles[index],
            })),
            customMessage: customMessage,
          };

          await reactionRole.create(reactionRoledb);
          await embedClass.successEmbed("Reaction roles successfully set up!");
        } catch (error) {
          console.error(`Error while setting up reaction role: ${error}`);
          await embedClass.failedEmbed(
            "An error occurred while setting up the reaction roles. Please try again."
          );
        }

        break;
      case "remove":
        try {
          await interaction.deferReply({ ephemeral: true });
          const reactionChannelId =
            interaction.options.getChannel("channel").id;
          const savedReactionsRole = await reactionRole.findOne({
            guildId: guildId,
            channelId: reactionChannelId,
          });

          if (!savedReactionsRole) {
            return await embedClass.failedEmbed(
              "No reaction roles found for this guild."
            );
          }
          await reactionRole.findOneAndDelete({ _id: savedReactionsRole._id });
          await embedClass.successEmbed("Reaction eoles successfully removed!");
        } catch (error) {
          console.error(`Error in remove reaction Role: ${error}`);
          await embedClass.failedEmbed(
            "An error occured while removing the reaction roles. please try again."
          );
        }
        break;
    }
  },
};
