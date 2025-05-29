const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "kick",
  description: "Kick a member",
  async execute(message, args) {
    async function successEmbed(msg) {
      const successEmbedMsg = new EmbedBuilder()
        .setDescription(msg)
        .setColor("#002540");
      const sendEmbed = await message.channel.send({
        embeds: [successEmbedMsg],
      });
      setTimeout(() => {
        sendEmbed.delete();
      }, 10_000);
    }
    async function failedEmbed(msg) {
      const failedEmbedMsg = new EmbedBuilder()
        .setDescription(msg)
        .setColor("#002540");
      const sendEmbed = await message.channel.send({
        embeds: [failedEmbedMsg],
        ephemeral: true,
      });
      setTimeout(() => {
        sendEmbed.delete();
      }, 10_000);
    }
    const executor = message.member;
    if (message.author.bot) return;
    if (!executor.permissions.has(PermissionFlagsBits.KickMembers)) {
      return failedEmbed(
        `You don't have enough permissions to kick a member\nRequired perms: **KICK MEMBER**`
      );
    }
    const user = args[0];
    if (!args[0])
      return failedEmbed(
        `huh! You should provide username or userid, and if are lazy for this just mention em bruh!`
      );
    let memberToKick;
    try {
      if (message.mentions.members.size) {
        memberToKick = message.mentions.members.first();
      } else if (/^\d{17,19}$/.test(user)) {
        memberToKick = await message.guild.members
          .fetch(user)
          .catch(() => null);
      } else {
        memberToKick = message.guild.members.cache.find(
          (member) =>
            member.user.username.toLowerCase() === user.toLowerCase() ||
            member.user.tag.toLowerCase() === InputDeviceInfo.toLowerCase()
        );
      }

      if (!memberToKick)
        return failedEmbed(`No user found ;-; are u sure you ain't on weed ?`);

      if (
        !message.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)
      ) {
        return failedEmbed(
          "Dude ykw, I also need perms to kick a member, and who told u to make changes in my default perms?"
        );
      }

      if (
        memberToKick.roles.highest.position >=
        message.member.roles.highest.position
      ) {
        return failedEmbed(
          "You cannot kick this member as they have a higher or equal role."
        );
      }
      await memberToKick.kick(`Kicked by ${message.author.tag}`);
      return successEmbed(
        `God granted your wish, Successfully kicked ${memberToKick.user.tag} from the server.`
      );
    } catch (error) {
      console.error(`Error while kicking an user: ${error}`);
      failedEmbed(
        `Sehhhhhhhhhhhh! seems like an internal error occured but ou can still ban that user so try to ban or just report this issue to my server dude to get it fixed ASAP.\n[server](https://discord.gg/99ugxRgyk5)`
      );
    }
  },
};
