const ChannelAlert = require("../../utils/channelAlert");

module.exports = {
  name: "guildMemberRemove",
  async execute(member) {
    const auditLogs = await member.guild.fetchAuditLog({
      type: 20,
      limit: 1,
    });
    const kickLog = auditLogs.entries.first();
    const leaveLogChannel = member.guild.channels.cache.find(
      (c) => c.name === "leave-log"
    );
    const channelAlert = new ChannelAlert(leaveLogChannel);
    if (leaveLogChannel) {
      return await channelAlert.dangerAlert(
        `User: <${member.id}>, left the server.`
      );
    } else if (kickLog && leaveLogChannel) {
      await channelAlert.dangerAlert(
        `Action: Kick\nUser: <@${member.id}>\nKicked by: ${kickLog.executor.tag}`
      );
    }
  },
};
