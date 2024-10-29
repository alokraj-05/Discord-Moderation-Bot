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
        .setDescription(
          `${
            msg != null
              ? `<a:32877animatedarrowbluelite:1284206601389215887> Afk set with reason: **${msg}**`
              : `<a:32877animatedarrowbluelite:1284206601389215887> ${username} afk is now set without any reason`
          }`
        )
        .setColor("#002540");
      const successmsgEmbed = await message.reply({ embeds: [successEmbed] });
      setTimeout(() => {
        successmsgEmbed.delete();
      }, 10_000);
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
