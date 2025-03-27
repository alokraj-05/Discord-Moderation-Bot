const ChannelAlert = require("../../utils/channelAlert");
const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "guildMemberUpdate",
  async execute(oldMember, newMember) {
    const adminLogChannel = newMember.guild.channels.cache.find(
      (c) => c.name === "admin-log"
    );

    if (adminLogChannel) {
      const channelAlert = new ChannelAlert(adminLogChannel);
      const replyTxt = `<@${newMember.id}> has ${
        newMember.permissions.has(PermissionFlagsBits.Administrator)
          ? "gained"
          : "lost"
      } administrator permissions.`;
      if (
        oldMember.permissions.has(PermissionFlagsBits.Administrator) !==
        newMember.permissions.has(PermissionFlagsBits.Administrator)
      ) {
        await channelAlert.successAlert(replyTxt);
      }
    }
  },
};
