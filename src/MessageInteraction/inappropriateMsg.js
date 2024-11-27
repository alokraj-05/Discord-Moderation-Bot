// const {} = require('discord.js')
const inappropriateWords = require("../models/inappropriate");

module.exports = {
  name: "check-inappropriate",
  description: "Prevent inappropriate words from users",
  async execute(client) {
    client.on("messageCreate", async (message) => {
      if (message.author.bot) return;
      const guildId = message.guild.id;

      try {
        const guild = await inappropriateWords.findOne({ guildId });
        if (!guild?.enabled) return;

        const word = guild.words.map((word) => word.word.toLowerCase());
        const messageContent = message.content.toLowerCase();

        const containsInappropriate = word.some((word) =>
          messageContent.includes(word)
        );
        if (!containsInappropriate) return;

        const ignoreRoles = guild.roleId || [];
        const hasIgnoredRole = ignoreRoles.some((roleId) =>
          message.member.roles.cache.has(roleId)
        );
        if (!hasIgnoredRole) {
          await message.delete();
        }
      } catch (error) {
        console.error(error);
      }
    });
  },
};
