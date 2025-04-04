const Alert = require("../../utils/alert");
const { PermissionFlagsBits } = require("discord.js");
module.exports = {
  name: "r",
  description: "add role to a user",

  async execute(message, args) {
    const alert = new Alert(message);
    const roleName = args[0];

    if (
      !message.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)
    ) {
      return alert.errorAlert(
        `I don't have \`manage roles\` perms to add Roles to a user`
      );
    }
    const executor = message.member;
    if (!executor.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return alert.errorAlert(
        `You don't have \`manage roles\` permission add or remove roles from a user.`
      );
    }

    if (!args[0])
      return alert.errorAlert(`Provide role name or mention the role`);
    if (!args[1])
      return alert.errorAlert(`Provide mention a user or provide their ID.`);
    let RoleId = "";
    if (roleName.includes("&")) {
      const roleId = roleName.split("&")[1].split(">")[0];
      RoleId = roleId;
    }

    const role =
      message.guild.roles.cache.find((role) => role.name === roleName) ||
      message.guild.roles.cache.get(RoleId);

    if (!role) {
      return message.reply("Role not found");
    }
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[1]).catch(() => null);

    if (!member) {
      return message.reply("User not found");
    }
    try {
      member.roles.add(role);
      await alert.successAlertNoDel(`Role ${role} added to ${member}`);
    } catch (error) {
      await alert.errorAlert(`something went wrong while adding role.`);
    }
  },
};
