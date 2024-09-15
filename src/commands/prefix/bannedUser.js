const { EmbedBuilder } = require("discord.js");
const { execute } = require("./setStatus");

module.exports = {
  name: "fb",
  description: "Fetch all the banned user from the server",
  async execute(message) {
    try {
      const bans = await message.guild.bans.fetch();
      if (bans.size === 0) {
        const noBannedUsersEmbed = new EmbedBuilder().setDescription(
          "<a:32877animatedarrowbluelite:1284206601389215887> `No banned users found in the server.`"
        );
        return message.reply({ embeds: [noBannedUsersEmbed] });
      }
      const bannedUsers = bans
        .map((ban) => `**${ban.user.tag}**  (ID: ${ban.user.id})`)
        .join("\n");

      const bannedMembersEmbed = new EmbedBuilder()
        .setDescription(`${bannedUsers}`)
        .setTitle(` <:76342banhammer:1284375769509920779>  Banned users`);
      return message.reply({ embeds: [bannedMembersEmbed] });
    } catch (error) {
      console.error(error);
      const errorEmbed = new EmbedBuilder().setDescription(
        `<:17927warning:1284208753339793408> An error occurred while executing the command`
      );
      message.reply({ embeds: [errorEmbed] });
    }
  },
};
