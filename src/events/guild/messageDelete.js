const ChannelAlert = require("../../utils/channelAlert");

module.exports = {
  name: "messageDelete",
  async execute(message) {
    if (!message.guild) return;

    const guildChannel = message.guild.channels.cache.find(
      (c) => c.name === "message-delete"
    );
    if (guildChannel) {
      const channelAlert = new ChannelAlert(guildChannel);
      return await channelAlert.dangerAlert(
        `Message deleted\nChannel:<#${message.channel.id}>\nDeleted by: <@${message.member.id}>\nMessage: \`${message.content}\``
      );
    }
    console.log(`No channel found named as "message-delete"`);
  },
};
