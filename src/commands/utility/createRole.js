const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create-roles")
    .setDescription("Create custom roles for your server")
    .addStringOption((option) =>
      option
        .setName("rolename")
        .setDescription("Enter name of the role")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("set-color")
        .setDescription("Set the color of the role in HEX formate")
        .setRequired(true)
    ),
  async execute(interaction) {
    const roleName = interaction.options.getString("rolename");
    const roleColor = interaction.options.getString("set-color");

    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.ManageRoles
      )
    ) {
      interaction.followUp({
        content: `I don't have permissions to manage roles`,
        ephemeral: true,
      });
    }

    if (
      !interaction.member.permissions.has(PermissionFlagsBits.ManageRoles) &&
      !interaction.member.has(PermissionFlagsBits.Administrator)
    ) {
      interaction.followUp({
        content: `You don't have enough permissions to manage roles`,
      });
    }

    const hexColorRegex = /^#[0-9A-F]{6}$/i;
    if (!hexColorRegex.test(roleColor)) {
      return interaction.reply({
        content: `Please provide a valid HEX color code`,
        ephemeral: true,
      });
    }

    const existingRole = interaction.guild.roles.cache.find(
      (role) => role.name.toLowerCase() === roleName.toLowerCase()
    );
    if (existingRole) {
      return interaction.reply({
        content: `The given role ${roleName} already exists in the server.`,
        ephemeral: true,
      });
    }

    const roleEmbed = new EmbedBuilder()
      .setColor(roleColor)
      .setTitle("**New Role Created**")
      .setDescription(
        `New role **${roleName}** is created by ${interaction.user.tag} successfully`
      )
      .setFooter({
        text: `Created by ${interaction.user.tag}`,
        iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}`,
      })
      .setTimestamp();

    try {
      const newRole = await interaction.guild.roles.create({
        name: roleName,
        color: roleColor,
        reason: `Roles created by ${interaction.user.tag} via bot command /create-roles`,
      });

      return interaction.reply({
        embeds: [roleEmbed],
      });
    } catch (error) {
      return interaction.reply({
        content: `There was an error occured while executing the program`,
      });
    }
  },
};
