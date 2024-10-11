const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  PermissionsBitField,
} = require("discord.js");
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
    await this.interaction.reply({
      embeds: [successMsgEmbed],
      ephemeral: true,
    });
  }

  async failedEmbed(msg) {
    const failedMsgEmbed = new EmbedBuilder()
      .setDescription(msg)
      .setColor("Red")
      .setTitle("Failed");
    await this.interaction.reply({
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
        .addStringOption((message) =>
          message
            .setName("message-id")
            .setDescription("Select the channel for the reaction roles")
            .setRequired(true)
        )
        .addRoleOption((role) =>
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
    )
    .addSubcommand((cmd) =>
      cmd
        .setName("remove")
        .setDescription("remove configured reaction roles")
        .addStringOption((channel) =>
          channel
            .setName("message-id")
            .setDescription("Provide the configured message id.")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const { guild, options, channel } = interaction;
    let e;
    const message = await channel.messages
      .fetch(options.getString("message-id"))
      .catch((err) => {
        e = err;
      });
    const role = options.getRole("roles");
    const reaction = options.getString("reactions");
    const guildId = guild.id;
    const embedClass = new Embeds(interaction);
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return embedClass.failedEmbed(
        `<:17927warning:1284208753339793408> You need administrator permission to execute this command.`
      );
    if (
      !interaction.guild.members.me.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return embedClass.failedEmbed(
        `<:17927warning:1284208753339793408> I don't have Admin Permissions to execute this command.`
      );

    const data = await reactionRole.findOne({
      guildId: guildId,
      messageId: message.id,
      reactions: reaction,
    });
    const sub = interaction.options.getSubcommand();
    switch (sub) {
      case "setup":
        if (data) {
          return await embedClass.successEmbed(
            `Seems like you already have this reaction setup using ${reaction} on this message.`
          );
        } else {
          await reactionRole.create({
            guildId: guildId,
            messageId: message.id,
            roles: role.id,
            reactions: reaction,
          });
        }
        await message.react(reaction).catch((err) => {});
        embedClass.successEmbed(
          `<:7100blurpleheart:1292733297507438604> I have added a reaction role to ${message.url} with ${reaction} and the role ${role}.`
        );
        break;
      case "remove":
        if (!data) {
          return await embedClass.failedEmbed(
            `<:17927warning:1284208753339793408> Please do check if that reaction role exist,I coudn't find any kind of reaction on that message.`
          );
        } else {
          await reactionRole.findOneAndDelete({ _id: data._id });
          await embedClass.successEmbed(
            `<:2870blurpletools:1292733083459784704> I have removed the reaction role from the ${message.url}.`
          );
        }
        break;
    }
  },
};
