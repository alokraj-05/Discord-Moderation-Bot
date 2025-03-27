const ChannelAlert = require("../../utils/channelAlert");

module.exports = {
  name: "guildMemberRemove",
  async execute(member) {
    const leaveLogChannel = member.guild.channels.cache.find(
      (c) => c.name === "leave-log"
    );
    if (leaveLogChannel) {
      const channelAlert = new ChannelAlert(leaveLogChannel);
      channelAlert.dangerAlert(`<@${member.id}>, left the server.`);
    }
  },
};
