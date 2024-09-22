const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { getPrefix } = require("../../prefix/getPrefix");
module.exports = {
  name: "purge",
  description: "Delete upto 100 messages",
  async execute(message, args) {
    async function failedEmbed(msg) {
      const failedmsgEmbed = new EmbedBuilder()
        .setDescription(msg)
        .setColor("Red");
      await message.reply({ embeds: [failedmsgEmbed], ephemeral: true });
    }
    async function successEmbed(msg) {
      const successmsgEmbed = new EmbedBuilder()
        .setDescription(msg)
        .setColor("Blurple");
      const successMessage = await message.channel.send({
        embeds: [successmsgEmbed],
        ephemereal: true,
      });
      setTimeout(() => {
        successMessage
          .delete()
          .catch((err) => console.error("Failed to delete message:", err));
      }, 10000);
    }
    const user = message.member;
    const amount = parseInt(args[0]);

    try {
      if (
        !message.guild.members.me.permissions.has(
          PermissionFlagsBits.ManageMessages
        )
      )
        await failedEmbed(
          `I don't have enough permissions to delete messages.\nRequired Permission: \`ManageMessages\``
        );
      if (!user.permissions.has(PermissionFlagsBits.ManageMessages)) {
        await failedEmbed(
          `You don't have the required permission to use this command.\nRequired Permission: \`ManageMessages\``
        );
        return;
      }
      if (!amount || amount < 1 || amount > 100) {
        const prefix = await getPrefix(message.guild.id);
        await failedEmbed(
          `Please enter a value in range \`1<= X >=100\`. \nForamt: \`${prefix}purge <value>\` .`
        );
        return;
      }
      const fetchedMessages = await message.channel.messages.fetch({
        limit: amount,
      });
      const messagesToDelete = fetchedMessages.filter((msg) => {
        const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
        return msg.createdTimestamp > twoWeeksAgo;
      });
      if (messagesToDelete.size === 0) {
        await failedEmbed(`No messages found that are younger than 14 days.`);
        return;
      }
      await message.channel.bulkDelete(messagesToDelete, true);
      await successEmbed(
        `Successfully deleted ${messagesToDelete.size} messages.`
      );
    } catch (err) {
      console.error(err);
      await failedEmbed(
        `An error occurred while deleting the messages please try again in a while. [Report](https://discord.gg/99ugxRgyk5)`
      );
    }
  },
};
