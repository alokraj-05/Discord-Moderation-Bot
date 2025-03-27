const ChannelAlert = require("../../utils/channelAlert");
const { execute } = require("./FetchGuilds");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    const welcomeChannel = member.guild.channels.cache.find(
      (c) => c.name === "join-log"
    );
    if (welcomeChannel) {
      const channelAlert = new ChannelAlert(welcomeChannel);
      channelAlert.successAlert(
        `<@${member.id}>, just joined **${member.guild.name}**!`
      );
    }
  },
};
