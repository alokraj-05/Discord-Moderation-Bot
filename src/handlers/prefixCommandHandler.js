const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");
const { getPrefix } = require("../prefix/getPrefix");

module.exports = (client) => {
  client.prefixCommands = new Collection();
  const commandFiles = fs
    .readdirSync(path.join(__dirname, "../commands/prefix"))
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`../commands/prefix/${file}`);

    client.prefixCommands.set(command.name, command);
    if (Array.isArray(command.aliases)) {
      for (const alias of command.aliases) {
        client.prefixCommands.set(alias, command);
      }
    }
  }

  client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild) return;

    const prefix = (await getPrefix(message.guild.id)) || "S!";
    const mentionPrefix = `<@${client.user.id}>`;

    let usedPrefix = null;

    if (message.content.startsWith(prefix)) {
      usedPrefix = prefix;
    } else if (message.content.startsWith(mentionPrefix)) {
      usedPrefix = mentionPrefix;
    }

    if (!usedPrefix) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.prefixCommands.get(commandName);
    if (!command) return;

    const { cooldowns } = client;
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Collection());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownsAmount = (command.cooldown ?? 3) * 1000;
    if (timestamps.has(message.author.id)) {
      const expirationTime =
        timestamps.get(message.author.id) + cooldownsAmount;
      if (now < expirationTime) {
        const timeLeft = Math.round((expirationTime - now) / 1000);
        return message.reply(`Wait dude, **${timeLeft}** more second(s) before 
        reusing \`${command.name}\`.`);
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownsAmount);
    try {
      await command.execute(message, args, client);
    } catch (error) {
      console.error(error);
      message.reply("There was an error executing that command.");
    }
  });
};
