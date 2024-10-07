const { EmbedBuilder } = require("discord.js");
const AfkModal = require("../../models/afk");

module.exports = {
  name: "afk",
  description: "Set afk for a user",

  async execute(message, args) {
    const username = message.author.displayName;
    const user = message.member.id;

    async function successmsgEmbed(msg) {
      const afkSince = new Date().toTimeString();
      const successEmbed = new EmbedBuilder()
        .setTitle(`<:1137kissoctopus:1292732821055737867> Afk set ${username}`)
        .setDescription(
          `${
            msg != null
              ? `<a:32877animatedarrowbluelite:1284206601389215887> Successfully created your afk with a reason | ${msg}`
              : "<a:32877animatedarrowbluelite:1284206601389215887> Your afk is now set with any reason"
          }\n<:event_badge:1292734443852795945> Afk since: ${afkSince}`
        )
        .setColor("Blurple")
        .setTimestamp();
      await message.reply({ embeds: [successEmbed] });
    }

    const guildId = message.guild.id;
    const reason = args.slice(0).join(" ") || "No reason provided";
    const afkSchema = {};
    afkSchema.userId = user;
    afkSchema.AfkReason = reason;
    afkSchema.guildId = message.guild.id;
    afkSchema.afkTimeStamp = message.createdTimestamp;

    const existingAfkUser = await AfkModal.findOne({
      userId: user,
      guildId: guildId,
    });
    if (existingAfkUser) return;
    if (!existingAfkUser) {
      await AfkModal.create(afkSchema);
      return await successmsgEmbed(reason);
    }
  },
};
