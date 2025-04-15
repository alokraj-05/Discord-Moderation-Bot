const {
  PermissionFlagsBits,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const Alert = require("../../utils/alert");
const { getPrefix } = require("../../prefix/getPrefix");
module.exports = {
  name: "massban",
  aliases: [],
  async execute(message, args) {
    const alert = new Alert(message);
    const prefix = await getPrefix(message.guild.id);
    const guildOwner = message.guild.ownerId;
    if (message.member.id !== guildOwner)
      return await alert.errorAlert(
        `Only guild owner can execute this commands (Due to security reasons.)`
      );
    const banCount = args[0];
    const reason = args.slice(1).join(" ") || "No reason provided";
    if (!banCount)
      return await alert.errorAlertWithTitle(
        `Missing argument: ban count\nSyntax:\`\`\`${prefix}massban <user_count <= 100>\`\`\``,
        "<:crossmark:1361344125177298978> Lacking required argument"
      );

    if (isNaN(banCount) || (banCount <= 0 && banCount >= 100))
      return await alert.errorAlert(
        `Invalid argument: ban count\nProvide a valid number of member to ban\nSyntax:\`\`\`${prefix}massban <user_count <= 100>\`\`\``
      );

    const members = await message.guild.members.fetch();
    const toBan = members
      .filter((m) => !m.user.bot && m.bannable)
      .first(banCount);

    if (!toBan.length)
      return await alert.errorAlert(
        `Their are no bannable user found.\nMay be they have admin perms or they are bot, use \`bon\``
      );
    const ban = new ButtonBuilder()
      .setCustomId("ban")
      .setLabel("Ban")
      .setStyle(ButtonStyle.Danger);
    const cancel = new ButtonBuilder()
      .setCustomId("cancel")
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Primary);
    const row = new ActionRowBuilder().addComponents(ban, cancel);

    const response = await message.reply({
      content: `Are you sure want to ban ${banCount} user(s)?`,
      components: [row],
    });

    const collectorFilter = (i) => i.user.id === message.member.id;
    try {
      const confirmation = await response.awaitMessageComponent({
        filter: collectorFilter,
        time: 30_000,
      });
      if (confirmation.customId === "ban") {
        let sucess = 0,
          failed = 0;
        for (const member of toBan) {
          try {
            await member.ban({ reason: reason });
            sucess++;
            await wait(1000);
          } catch (error) {
            failed++;
          }
        }
        await confirmation.update({
          content: `<:checkmark:1361343723211985107> Banned ${sucess} user(s) and <:crossmark:1361344125177298978> failed ${failed} user`,
          components: [],
        });
      } else if (confirmation.customId === "cancel") {
        await confirmation.update({
          content: `Action cancelled`,
          components: [],
        });
      }
    } catch (error) {
      console.error(error);
      await message.reply({
        content: `Mass ban cancelled\nConfirmation not received within 30sec.`,
        components: [],
      });
    }
  },
};
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
