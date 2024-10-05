const { EmbedBuilder } = require("discord.js");
const AfkModal = require("../../models/afk");

module.exports = {
  name: "afk",
  description: "Set afk for a user",

  async execute(message, args) {
    const username = message.author.displayName;
    const user = message.member.id;

    async function successmsgEmbed(msg, timestamp) {
      const afkSince = new Date(timestamp).toLocaleString();
      const successEmbed = new EmbedBuilder()
        .setTitle(`Afk set ${username}`)
        .setDescription(
          `${
            msg != null
              ? `Successfully created your afk with a reason | ${msg}`
              : "Your afk is now set with any reason"
          }\n Afk since: ${afkSince}`
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
