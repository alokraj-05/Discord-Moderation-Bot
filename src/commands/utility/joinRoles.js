const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const joinRole = require("../../models/joinRoles");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("joinrole")
    .setDescription("Give a default role to new memebers.")
    .addSubcommand((cmd) =>
      cmd
        .setName("add")
        .setDescription("Add a default role for new user")
        .addRoleOption((role) =>
          role
            .setName("role")
            .setDescription("Select the role")
            .setRequired(true)
        )
    )
    .addSubcommand((cmd) =>
      cmd
        .setName("remove")
        .setDescription("Remove the default join role")
        .addRoleOption((role) =>
          role
            .setName("remove-role")
            .setDescription("Select the role")
            .setRequired(true)
        )
    )
    .addSubcommand((cmd) =>
      cmd
        .setName("update")
        .setDescription("Update the pre existing default join role")
        .addRoleOption((role) =>
          role
            .setName("new-role")
            .setDescription("Update the join role")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const { options } = interaction;
    async function failedEmbed(msg) {
      const failedmsgEmbed = new EmbedBuilder()
        .setTitle("Permission denied")
        .setDescription(msg)
        .setColor("Red");

      const failedMesage = await interaction.reply({
        embeds: [failedmsgEmbed],
        ephemeral: true,
      });
      setTimeout(() => {
        failedMesage.delete();
      }, 5000);
    }
    async function successEmbed(msg) {
      const successmsgEmbed = new EmbedBuilder()
        .setTitle("Permission denied")
        .setDescription(msg)
        .setColor("Blurple");

      const successMessage = await interaction.reply({
        embeds: [successmsgEmbed],
        ephemeral: true,
      });
      setTimeout(() => {
        successMessage.delete();
      }, 5000);
    }
    const sub = options.getSubcommand();
    switch (sub) {
      case "add":
        const role = interaction.options.getRole("role");
        if (
          !interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)
        ) {
          return await failedEmbed(
            `You don't have permission to set join roles for the guild.\nRequired permission: **Manage Roles**`
          );
        }
        const roleName = role.name;
        const roleId = role.id;
        const guildId = interaction.guild.id;
        let existingJoinRole = await joinRole.findOne({ guildId });

        // If join roles already exist for the guild
        if (existingJoinRole) {
          // Check if the role is already in the list
          existingJoinRole.roles = existingJoinRole.roles || [];
          const roleExists = existingJoinRole.roles.some(
            (r) => r.roleId === roleId
          );

          if (roleExists) {
            // If the role already exists, send a message
            return await failedEmbed(
              `${role} is already set as a default join role for this guild.`
            );
          }

          // Add the new role to the list of roles
          existingJoinRole.roles.push({ roleId, roleName });
          await existingJoinRole.save();

          // List all the roles that are now set as join roles
          const roleList = existingJoinRole.roles
            .map((r) => `<@&${r.roleId}>`)
            .join(", ");
          await successEmbed(
            `Successfully added ${role} as a default join role.\nCurrent join roles: ${roleList}`
          );
        } else {
          // If no roles are set, create a new entry for the guild
          const newJoinRole = new joinRole({
            guildId,
            roles: [{ roleId, roleName }],
          });
          await newJoinRole.save();

          await successEmbed(
            `Successfully added ${role} as the first default join role for this guild.`
          );
        }

        break;

      case "update":
        const updatedRole = interaction.options.getRole("new-role");
        if (
          !interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)
        ) {
          return await failedEmbed(
            `You don't have permission to update the predefined defualt role.\nPermission required: **Manage Roles**`
          );
        }
        await joinRole.findOneAndUpdate({
          guildId: interaction.guild.id,
          roleId: updatedRole.id,
          roleName: updatedRole.name,
        });
        await successEmbed(
          `Successfully updated the default join role to ${updatedRole}.`
        );
        break;
    }
  },
};
