const { Events } = require("discord.js");
const WebhookLogger = require("../../utils/webhookLog");
const logger = new WebhookLogger();

module.exports = {
  name: "guildCreate",
  async execute(guild) {
    const embed = {
      title: `Bot Added to new server`,
      fields: [
        { name: "server", value: guild.name, inline: true },
        { name: "ID", value: guild.id, inline: true },
        { name: "Members", value: `${guild.memberCount}`, inline: true },
      ],
      footer: { text: `Total servers: ${guild.client.guilds.cache.size}` },
    };

    await logger.sendLog("guildJoin", embed);
  },
};
