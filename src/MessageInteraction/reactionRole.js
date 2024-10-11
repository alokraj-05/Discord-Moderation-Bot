const { Events } = require("discord.js");
const reactionRole = require("../models/reactionRoles");
const { description, execute } = require("./joinRole");

module.exports = {
  name: "reaction-roles",
  description: "Add or remove reaction roles",
  async execute(client) {
    client.on(Events.MessageReactionAdd, async (reaction, user) => {
      if (!reaction.message.guildId) return;
      if (user.bot) return;

      let cID = `<:${reaction.emoji.name}:${reaction.emoji.id}`;
      if (!reaction.emoji.id) cID = reaction.emoji.name;

      const data = await reactionRole.findOne({
        guildId: reaction.message.guildId,
        messageId: reaction.message.id,
        reactions: cID,
      });
      if (!data) return;

      const guild = await client.guilds.cache.get(reaction.message.guildId);
      const member = await guild.members.cache.get(user.id);

      try {
        await member.roles.add(data.roles);
      } catch (error) {
        return;
      }
    });
    client.on(Events.MessageReactionRemove, async (reaction, user) => {
      if (!reaction.message.guildId) return;
      if (user.bot) return;

      let cID = `<:${reaction.emoji.name}:${reaction.emoji.id}`;
      if (!reaction.emoji.id) cID = reaction.emoji.name;

      const data = await reactionRole.findOne({
        guildId: reaction.message.guildId,
        messageId: reaction.message.id,
        reactions: cID,
      });
      if (!data) return;

      const guild = await client.guilds.cache.get(reaction.message.guildId);
      const member = await guild.members.cache.get(user.id);

      try {
        await member.roles.remove(data.roles);
      } catch (error) {
        return;
      }
    });
  },
};
