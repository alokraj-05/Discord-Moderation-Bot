const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { execute } = require("./setStatus");

module.exports = {
  name: "ub",
  description: "Unbans a user",
  async execute(message, args) {
    try {
      const noPermsEmbed = new EmbedBuilder().setDescription(
        "You don't have enough permissions to unban a memeber."
      );
      if (
        !message.member.permissions.has(PermissionsBitField.Flags.BanMembers)
      ) {
        return message.reply({ embeds: [noPermsEmbed] });
      }
      const userId = args[0];
      const noMentionUserEmbed = new EmbedBuilder().setDescription(
        "<:19999member:1284206898953850942> `Please mention a user to unban.`"
      );
      if (!userId) return message.reply({ embeds: [noMentionUserEmbed] });
      const noBanUserEmbed = new EmbedBuilder().setDescription(
        `<:17927warning:1284208753339793408> No banned user found with this id. Please check the username and try again.`
      );

      const bans = await message.guild.bans.fetch();
      const bannedUser = bans.find((ban) => ban.user.id === userId);
      if (!bannedUser) return message.reply({ embeds: [noBanUserEmbed] });

      const bansRemoveEmbed = new EmbedBuilder().setDescription(
        `<:52714verified:1284208131525705828> Successfully unbaned ${userId}`
      );
      await message.guild.bans.remove(userId);
      return message.reply({ embeds: [bansRemoveEmbed] });
    } catch (error) {
      const errorBannedEmbed = new EmbedBuilder().setDescription(
        "<:17927warning:1284208753339793408> `An error occurred while executing the command.`"
      );
      console.error(error);
      message.reply({ embeds: [errorBannedEmbed] });
    }
  },
};
