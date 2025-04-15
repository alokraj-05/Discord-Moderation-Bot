const { PermissionFlagsBits } = require("discord.js");
const Alert = require("../../utils/alert");
const { getPrefix } = require("../../prefix/getPrefix");
module.exports = {
  name: "admin",
  description: "log admin perms",
  async execute(message, args) {
    const alert = new Alert(message);
    const executor = message.member;
    const cmd = args[0];
    const flag = args[1];
    const guild = message.guild;
    const prefix = await getPrefix(guild.id);
    if (!cmd)
      return alert.errorAlert(
        `Users with admin perms\n\`\`\`${prefix}admin u\n${prefix}admin users\`\`\`\nRole with admin perms use\n\`\`\`${prefix}admin r\n${prefix}admin role\`\`\``
      );
    switch (cmd) {
      case "users":
      case "u": {
        const adminPermsUsers = [];
        const adminPermsUser = guild.members.cache.filter((member) => {
          return (
            member.permissions.has(PermissionFlagsBits.Administrator) &&
            !member.user.bot
          );
        });
        if (flag && flag === "-b") {
          const adminPermsBot = [];
          const adminPermsUserBot = guild.members.cache.filter(
            (bot) =>
              bot.permissions.has(PermissionFlagsBits.Administrator) &&
              bot.user.bot
          );
          adminPermsUserBot.forEach((bot) => adminPermsBot.push(bot.id));
          return alert.successAlertNoDel(
            `Bot with Admin perms\n${adminPermsBot.map((bot) => `<@${bot}>`)}`
          );
        } else if (flag && flag !== "-b") {
          return alert.errorAlertWithTitle(
            `Use\n\`\`\`${prefix}admin u -b\`\`\`\nLogs all the bot with admin perms`,
            `Invalid Flag`
          );
        } else {
          adminPermsUser.forEach((user) => {
            adminPermsUsers.push(user.user.username);
          });
          if (adminPermsUsers.length === 0) {
            return alert.errorAlert(`No users with admin perms found.`);
          }
          return await alert.successAlertNoDel(
            `Total users: ${
              adminPermsUsers.length
            }\nUser names: ${adminPermsUsers.join(", ")}`
          );
        }
      }
      case "role":
      case "r": {
        const adminPermsRoles = [];
        const adminPermsRole = guild.roles.cache.filter((role) => {
          return role.permissions.has(PermissionFlagsBits.Administrator);
        });
        adminPermsRole.forEach((role) => {
          adminPermsRoles.push(role.id);
        });
        if (adminPermsRoles.length === 0) {
          return alert.errorAlert(`No roles with admin perms found.`);
        }
        return await alert.successAlertNoDel(
          `Total roles: ${adminPermsRoles.length}\n ${
            adminPermsRoles.length > 1 ? "Roles" : "Role"
          }: ${adminPermsRoles.map((role) => `<@&${role}>`)}`
        );
      }
      default: {
        return alert.errorAlert(
          `Command Syntax\nUser with admin perms\`\`\`${prefix}admin u\n${prefix}admin users\`\`\`\nRole with admin perms use\n\`\`\`${prefix}admin r\n${prefix}admin role\`\`\``
        );
      }
    }
  },
};
