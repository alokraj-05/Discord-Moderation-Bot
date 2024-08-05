module.exports = {
  name: "kick",
  description: "Kicks an user",
  async execute(message, args) {
    if (!message.member.permissions.has("KICK_MEMBERS")) {
      return message.reply("You don't have permission to use this command.");
    }

    const member = message.guild.members.cache.get(user_id);
    if (!member) {
      return message.reply("That user isn't in the Server.");
    }

    const reason = args.slics(1).join(" ") || "No reason provided.";
    await member.kick(reason);

    message.channel.send(`${user.tag} has been kicked for: ${reason}`);
  },
};
