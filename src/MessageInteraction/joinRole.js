const {} = require("discord.js");
const joinRole = require("../models/joinRoles");

module.exports = {
  name: "join-role",
  description: "Give configured role to the new joined user",
  async execute(client) {
    client.on("guildMemberAdd", async (member) => {
      const guildId = member.guild.id;
      if (!guildId) return;

      const existingGuild = await joinRole.findOne({ guildId: guildId });
      if (existingGuild) {
        const roleInGuild = member.guild.roles.cache.map((role) => role.id);
        const joinRole = existingGuild.roles.map((role) => role.roleId);
        for (const eachRole of joinRole) {
          for (const eachRoleInGuild of roleInGuild) {
            if (eachRole === eachRoleInGuild) {
              member.roles.add(eachRoleInGuild);
            }
          }
        }
      }
    });
  },
};
