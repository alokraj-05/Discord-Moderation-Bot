const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "sn",
  description: "Change a user's nickname",
  async execute(message, args) {
    const user = message.mentions.users.first();
    const member = message.guild.members.resolve(user);
    if (!member) return message.reply("User not found.");

    const newNickname = args.slice(1).join(" ");
    if (!user || !newNickname)
      return message.reply("Please mention a user and provide a new nickname.");

    const executor = message.member;
    if (!executor.permissions.has(PermissionsBitField.Flags.ChangeNickname)) {
      return message.reply(
        "You don't have permission to set nickname for a member."
      );
    }

    if (
      !executor.permissions.has(PermissionsBitField.Flags.Administrator) &&
      member.roles.highest.position >= executor.roles.highest.position
    ) {
      return message.reply(
        `You can't set a nickname for **${member.displayName}**. Reason: **${member.displayName}** has a higher position.`
      );
    }
    try {
      await member.setNickname(newNickname);
      const embed = new EmbedBuilder()
        .setColor("#00ff00")
        .setTitle("Nickname Changed")
        .setDescription(
          `✏️ ${user.tag}'s nickname has been changed to ${newNickname}.`
        );

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.reply(
        "There was an error trying to set name for the user. Please try again later"
      );
    }
  },
};
