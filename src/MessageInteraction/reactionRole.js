const reactionRole = require("../models/reactionRoles");

module.exports = {
  name: "reaction-role",
  description: "Add or remove reaction roles based on reactions",
  async execute(client) {
    client.on("messageReactionAdd", async (reaction, user) => {
      try {
        // Fetching if the message or reaction is partial (not cached)
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();

        // Ignore bots
        if (user.bot) return;

        const emoji = reaction.emoji;

        // Logging the reaction info for debugging
        if (emoji.id) {
          console.log(`Custom emoji reacted: ${emoji.name} (ID: ${emoji.id})`);
        } else {
          console.log(`Standard emoji reacted: ${emoji.name}`);
        }

        // Fetch the reaction role data from the database
        const data = await reactionRole.findOne({
          guildId: reaction.message.guildId,
          messageId: reaction.message.id,
          reactions: emoji.id || emoji.name, // Support for both custom and standard emojis
        });

        if (!data) {
          console.log("No reaction role found for this reaction.");
          return;
        }

        // Fetch the guild and the member
        const guild = reaction.message.guild;
        const member = await guild.members.fetch(user.id);

        // Add the role
        await member.roles.add(data.roles);
        console.log(`Role added: ${data.roles} to user ${user.tag}`);
      } catch (error) {
        console.error("Error handling reaction add:", error);
      }
    });

    // Remove role when the reaction is removed (optional, if you want this feature)
    client.on("messageReactionRemove", async (reaction, user) => {
      try {
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();

        if (user.bot) return;

        const emoji = reaction.emoji;

        const data = await reactionRole.findOne({
          guildId: reaction.message.guildId,
          messageId: reaction.message.id,
          reactions: emoji.id || emoji.name,
        });

        if (!data) {
          console.log("No reaction role found for this reaction removal.");
          return;
        }

        const guild = reaction.message.guild;
        const member = await guild.members.fetch(user.id);

        // Remove the role
        await member.roles.remove(data.roles);
        console.log(`Role removed: ${data.roles} from user ${user.tag}`);
      } catch (error) {
        console.error("Error handling reaction remove:", error);
      }
    });
  },
};
