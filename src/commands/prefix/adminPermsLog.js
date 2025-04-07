const { PermissionFlagsBits } = require("discord.js");
const Alert = require("../../utils/alert");

module.exports = {
  name: "admin",
  description: "log admin perms",
  async execute(message, args) {
    const alert = new Alert(message);
    const executor = message.member;
    const guild = message.guild;
    const adminPermsUsers = [];
    const adminPermsUser = guild.members.cache.filter((member) => {
      return (
        member.permissions.has(PermissionFlagsBits.Administrator) &&
        !member.user.bot
      );
    });
    adminPermsUser.forEach((user) => {
      adminPermsUsers.push(user.user.username);
    });
    if (adminPermsUsers.length === 0) {
      return alert.errorAlert(`No users with admin perms found.`);
    }
    await alert.successAlertNoDel(
      `Total users: ${
        adminPermsUsers.length
      }\nUser names: ${adminPermsUsers.join(", ")}`
    );
  },
};
