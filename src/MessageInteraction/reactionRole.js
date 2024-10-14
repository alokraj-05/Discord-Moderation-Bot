const { Events } = require("discord.js");
const reactionRole = require("../models/reactionRoles");

module.exports = {
  name: "reaction-role",
  description: "Add or remove reaction roles based on reactions",
  async execute(client) {
    client.on("raw", async (packet) => {
      // We only care about MESSAGE_REACTION_ADD and MESSAGE_REACTION_REMOVE events
      if (
        !["MESSAGE_REACTION_ADD", "MESSAGE_REACTION_REMOVE"].includes(packet.t)
      )
        return;

      const { d: data } = packet;
      const channel = await client.channels.fetch(data.channel_id);

      // Fetch the message (ensure partial fetching if not cached)
      let message = channel.messages.cache.get(data.message_id);
      if (!message) {
        // Message not in cache, try to fetch it
        try {
          message = await channel.messages.fetch(data.message_id);
        } catch (err) {
          console.error(`Could not fetch the message: ${err}`);
          return;
        }
      }

      const emoji = data.emoji
        ? `<a:${data.emoji.name}:${data.emoji.id}>`
        : // ? `<a:${data.emoji.name}:${data.emoji.id}`
          // : `<:${data.emoji.name}:${data.emoji.id}`
          data.emoji.name;

      // Ensure user is fetched
      const user = await client.users.fetch(data.user_id).catch(console.error);
      if (!user) return;

      // Fetch reaction role data from database
      const reactionData = await reactionRole.findOne({
        guildId: message.guild.id,
        messageId: message.id,
        reactions: emoji,
      });

      if (!reactionData) return; // No reaction role set up for this reaction

      // Fetch the guild member
      const member = await message.guild.members
        .fetch(user.id)
        .catch(console.error);
      if (!member) return;

      // Add or remove roles based on event type
      if (packet.t === "MESSAGE_REACTION_ADD") {
        // Add role to the user
        await member.roles.add(reactionData.roles).catch(console.error);
        console.log(
          `Added role ${reactionData.roles} to ${member.user.tag} for reaction ${emoji}`
        );
      } else if (packet.t === "MESSAGE_REACTION_REMOVE") {
        // Optionally remove the role when the reaction is removed
        await member.roles.remove(reactionData.roles).catch(console.error);
        console.log(
          `Removed role ${reactionData.roles} from ${member.user.tag} for reaction ${emoji}`
        );
      }
    });
  },
};
