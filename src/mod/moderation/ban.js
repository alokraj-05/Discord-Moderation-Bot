module.exports = {
  name: "ban",
  description: "Bans an user",
  async execute(message, args) {
    if (!message.member.permission.has("BAN_MEMBERS")) {
      return message.reply("You don't have permission to use this command");
    }

    const user = message.mentions.users.first();
    if (!user) {
      return message.reply("You need to mention the user first");
    }

    const member = message.guild.member.cache.get(user.id);
    if (!member) {
      return message.reply("This user isn't in the server");
    }

    const reason = args.slice(1).join(" ") || "No reason provided";
    await member.ban({ reason });

    message.channel.send(`${user.tag} has been banned for: ${reason}`);
  },
};
