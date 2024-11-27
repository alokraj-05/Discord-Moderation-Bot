const {
  EmbedBuilder,
  PermissionFlagsBits,
  PermissionsBitField,
} = require("discord.js");
const inappropriateWords = require("../../models/inappropriate");

module.exports = {
  name: "iw",
  description: "Set inappropriate words",
  async execute(message, args) {
    async function successEmbed(msg) {
      const successEmbedMsg = new EmbedBuilder()
        .setDescription(msg)
        .setColor("#002540");

      const sendSucessEmbed = await message.channel.send({
        embeds: [successEmbedMsg],
      });
      setTimeout(() => {
        sendSucessEmbed.delete();
      }, 10_000);
    }
    async function failedEmbed(msg) {
      const failedEmbedMsg = new EmbedBuilder()
        .setDescription(msg)
        .setColor("Red");

      const FailedMessageEmbed = await message.channel.send({
        embeds: [failedEmbedMsg],
        ephemeral: true,
      });
      setTimeout(() => {
        FailedMessageEmbed.delete();
      }, 10_000);
    }

    const executor = message.member;
    const guildId = message.guild.id;
    if (!executor.permissions.has(PermissionsBitField.Flags.ManageMessages))
      return failedEmbed(
        `You cannot set inappropraite words\nRequired perms: Manage Messages`
      );

    try {
      const existingGuild = await inappropriateWords.findOne({ guildId });

      if (!existingGuild) {
        const isSetup = args[0]?.toLowerCase() === "true";
        if (!isSetup)
          return failedEmbed(`Use ".iw true <words>" for first-time setup.`);
        const words = args.slice(1).join(" ");
        if (!words) return failedEmbed(`Please provide words to add.`);

        const GuildDb = await inappropriateWords.create({
          guildId: guildId,
          enabled: true,
        });
        GuildDb.words.push({ word: words });
        await GuildDb.save();

        return successEmbed(
          `Enabled inappropriate words and added: **${words}**`
        );
      }

      const subCommand = args[0]?.toLowerCase();
      if (subCommand === "ignore-role") {
        if (!args[1]) return failedEmbed(`Please mention roles to ignore.`);

        const roleIds = message.mentions.roles.map((role) => role.id);
        if (roleIds.length === 0)
          return failedEmbed(`ou must mention valid roles.`);

        existingGuild.roleId = [
          ...new Set([...(existingGuild.roleId || []), ...roleIds]),
        ];

        await existingGuild.save();
        return successEmbed(
          `Updated ignored roled: ${existingGuild.roleId
            .map((id) => `<@&${id}>`)
            .join(", ")}`
        );
      } else if (subCommand === "show") {
        const wordList = existingGuild.words.map((word) => word.word);
        return successEmbed(
          `Inappropriate ${
            wordList.length > 1 ? `words are` : `word is`
          }: **${wordList.join(", ")}**`
        );
      } else if (subCommand === "remove") {
        const requestedWord = args.slice(1).join(" ").toLowerCase();
        const wordList = existingGuild.words.map((word) =>
          word.word.toLowerCase()
        );
        const wordIndex = wordList.indexOf(requestedWord);
        if (wordIndex !== -1) {
          existingGuild.words.splice(wordIndex, 1);
          await existingGuild.save();
          return successEmbed(
            `Removed the word "${requestedWord}" from the inappropriate word list.`
          );
        } else {
          return failedEmbed(
            `The word "${requestedWord}" is not in the inappropriate word list.`
          );
        }
      }
      const words = args.join(" ");
      if (!words) return failedEmbed(`Please provide words to add.`);

      const existingWords = existingGuild.words;
      const extTrue = existingWords.some((word) => word.word === word);
      if (extTrue) {
        successEmbed(
          `Word **${words}** already exists as an inappropriate word.`
        );
      }
      existingGuild.words.push({ word: words });
      await existingGuild.save();
      return successEmbed(`Added word **${words}** to inappropriate word.`);
    } catch (error) {
      console.error(
        `Error while executing setting up inappropriate words: ${error}`
      );
      failedEmbed(`Error while setting up inappropriate words`);
    }
  },
};
