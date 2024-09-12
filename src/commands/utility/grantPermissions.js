const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const UserPermissions = require("../../models/userPermissions");

const BOT_OWNER_ID = process.env.BOT_OWNER_ID;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("grantpermissions")
    .setDescription("Grant special permissions to a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to grant permissions to")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("The command to grant permission for")
        .setRequired(true)
    ),
  async execute(interaction) {
    const { user, guild } = interaction;

    if (user.id !== BOT_OWNER_ID) {
      return await interaction.reply(
        "Only the bot owner can grant permissions."
      );
    }

    const targetUser = interaction.options.getUser("user");
    const command = interaction.options.getString("command");

    try {
      // Find or create user permissions
      const userPerms = await UserPermissions.findOneAndUpdate(
        { guildId: guild.id, userId: targetUser.id },
        { $addToSet: { permissions: command } },
        { upsert: true, new: true }
      );

      await interaction.reply(
        `Permission for the \`${command}\` command has been granted to ${targetUser.tag}.`
      );
    } catch (error) {
      console.error("Error granting permissions:", error);
      await interaction.reply("There was an error while granting permissions.");
    }
  },
};
