const { Events } = require("discord.js");
const ChannelAlert = require("../../utils/channelAlert");
module.exports = {
  name: "voiceStateUpdate",
  async execute(oldState, newState) {
    if (!newState.guild) return;

    const vcLogChannel = newState.guild.channels.cache.find(
      (c) => c.name === "vc-log"
    );

    if (!vcLogChannel) return;
    const channelAlert = new ChannelAlert(vcLogChannel);
    const time = new Date().toISOString();
    if (!oldState.channel && newState.channel) {
      return await channelAlert.successAlert(
        `User: <@${newState.id}>\nEvent: \`joined voice channel\`\nChannel: <#${newState.channel.id}>\nTime: ${time}`
      );
    }
    if (oldState.channel && !newState.channel) {
      return await channelAlert.successAlert(
        `User: <@${newState.id}>\nEvent: \`left voice channel\`\nChannel: <#${oldState.channel.id}>\nTime: ${time}`
      );
    }
    if (oldState.channel && newState.channel) {
      return await channelAlert.successAlert(
        `User: <@${newState.id}>\nEvent: \`switched voice channel\`\nFrom: <#${oldState.channel.id}>\nTo: <#${newState.channel.id}>\nTime: ${time}`
      );
    }
  },
};
