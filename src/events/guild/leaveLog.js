const ChannelAlert = require("../../utils/channelAlert");
const { AuditLogEvent } = require("discord.js");
module.exports = {
  name: "guildMemberRemove",
  async execute(member) {
    const leaveLogChannel = member.guild.channels.cache.find(
      (c) => c.name === "leave-log"
    );
    const channelAlert = new ChannelAlert(leaveLogChannel);
    if (!leaveLogChannel) return;

    try {
      const auditLogKick = await member.guild.fetchAuditLogs({
        type: AuditLogEvent.MemberKick,
        limit: 1,
      });
      const auditLogBan = await member.guild.fetchAuditLogs({
        type: AuditLogEvent.MemberBanAdd,
        limit: 1,
      });
      const kickLog = auditLogKick.entries.first();
      const banLog = auditLogBan.entries.first();
      if (
        kickLog &&
        kickLog.target.id === member.id &&
        Date.now() - kickLog.createdTimeStamp < 5000
      ) {
        await channelAlert.dangerAlert(
          `Action: Kick\nUser: <@${member.id}>\nKicked by: ${kickLog.executor.tag}`
        );
      } else if (
        banLog &&
        banLog.target.id === member.id &&
        Date.now() - banLog.createdTimeStamp < 5000
      ) {
        await channelAlert.dangerAlert(
          `Action: Ban\nUser: <@${member.id}>\nBanned by: ${banLog.executor.tag}`
        );
      } else {
        await channelAlert.dangerAlert(
          `User: <@${member.id}>, left the server.`
        );
      }
    } catch (error) {}
  },
};
