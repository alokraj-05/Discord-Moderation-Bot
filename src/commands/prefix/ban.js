const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "ban",
  description: "Ban a user",
  async execute(message, args) {
    const noUserEmbed = new EmbedBuilder().setDescription(
      "Please mention a user to ban."
    );
    const user = message.mentions.users.first();
    if (!user) return message.reply({ embeds: [noUserEmbed] });

    const member = message.guild.members.resolve(user);
    if (!member) return message.reply("User not found.");

    const executor = message.member;
    if (
      !executor.permissions.has(PermissionsBitField.Flags.Administrator) &&
      !executor.permissions.has(PermissionsBitField.Flags.BanMembers)
    ) {
      return message.reply(
        "You do not have enough permissions to ban a member."
      );
    }
    if (
      !executor.permissions.has(PermissionsBitField.Flags.Administrator) &&
      member.roles.highest.position >= executor.roles.highest.position
    ) {
      return message.reply(
        "You can't ban members with a higher or equal role than yours."
      );
    }
    const reason = args.slice(1).join(" ") || "No reason provided";

    try {
      await member.ban();
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("User Banned")
        .setDescription(
          `<:76342banhammer:1284375769509920779> ${user.tag} has been banned.`
        )
        .addFields({ name: "Reason", value: reason });
      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.reply(
        "There was an error trying to ban the user. Please try again later"
      );
    }
  },
};
