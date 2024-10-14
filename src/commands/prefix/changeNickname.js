const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "sn",
  description: "Change a user's nickname",
  async execute(message, args) {
    async function failedEmbed(msg) {
      const failedMsgEmbed = new EmbedBuilder()
        .setTitle("Failed")
        .setDescription(msg)
        .setColor("Red");
      const sendFailedEmbed = await message.reply({ embeds: [failedMsgEmbed] });
      setTimeout(() => {
        sendFailedEmbed
          .delete()
          .catch((err) =>
            console.log(`Failed to delete failed embed ${err.message}`)
          );
      }, 10000);
    }

    const user = message.mentions.users.first();
    if (!user) return failedEmbed("Please mention the user first.");
    const member = message.guild.members.resolve(user);
    if (!member) return failedEmbed("Member not found.");

    const newNickname = args.slice(1).join(" ");
    if (!newNickname) return failedEmbed(`Please provide a username.`);
    if (
      !message.guild.members.me.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return failedEmbed(
        `I don't have admin permission to set nickname for the user.`
      );
    }

    const executor = message.member;
    if (executor.id == user.id) {
      return failedEmbed(`You can't set a nickname for yourself.`);
    }

    if (!executor.permissions.has(PermissionsBitField.Flags.ChangeNickname)) {
      return failedEmbed(
        `You don't have permission to change a member's nickname.\nRequired permissions: \`Change Nickname\``
      );
    }

    if (member.roles.highest.position >= executor.roles.highest.position) {
      return failedEmbed(
        `You can't set a nickname for **${member.displayName}**. Reason: **${member.displayName}** has a higher position.`
      );
    }
    if (
      executor.permissions.has(PermissionsBitField.Flags.Administrator) &&
      executor.roles.highest.position > member.roles.highest.position
    ) {
      try {
        await member.setNickname(newNickname);
        const embed = new EmbedBuilder()
          .setColor("Blurple")
          .setTitle("Nickname Changed")
          .setDescription(
            `✏️ ${user.tag}'s nickname has been changed to ${newNickname}.`
          );

        return await message.channel.send({ embeds: [embed] });
      } catch (error) {
        console.error(
          `Error while chaning nickname for the user ${member.name} [ ERROR ]: ${error}`
        );
      }
    }

    if (
      member.roles.highest.position > executor.roles.highest.position ||
      member.permissions.has(PermissionsBitField.Flags.Administrator)
    ) {
      return failedEmbed(
        `You can't change the nickname of **${member.displayName}**. They have higher or admin permissions.`
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
