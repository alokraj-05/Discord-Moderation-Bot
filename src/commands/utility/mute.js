const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const Alert = require("../../utils/alert");

class MuteUser {
  constructor(interaction) {
    this.interaction = interaction;
  }
  alert = new Alert(this.interaction);
  async mute(user) {
    await user.timeout(60000, "");
  }
  async muteWithDuration(user, duration) {
    await user.timeout(duration, "");
  }

  async unmute(user) {
    user.timeout(null);
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mute a server member, default duration 1 minute.")
    .addSubcommand((cmd) =>
      cmd
        .setName("add")
        .setDescription("Set timeout for a user.")
        .addUserOption((usr) =>
          usr.setName("user").setDescription("Select a user").setRequired(true)
        )
        .addNumberOption((duration) =>
          duration
            .setName("duration")
            .setDescription("Set duration in minutes.")
        )
        .addStringOption((msg) =>
          msg
            .setName("reason")
            .setDescription("Provide a reason to mute the member.")
        )
    )
    .addSubcommand((cmd) =>
      cmd
        .setName("remove")
        .setDescription("Remove timeout for a user.")
        .addUserOption((user) =>
          user
            .setName("target")
            .setDescription("Select a user to unmute.")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const alert = new Alert(interaction);
    const muteMember = new MuteUser(interaction);

    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.MuteMembers
      )
    ) {
      return alert.errorAlert(
        "I don't have enough permissions to mute the member.\nRequired perms:`Mute members`"
      );
    }

    const sub = interaction.options.getSubcommand();
    switch (sub) {
      case "add":
        const targetUser = interaction.options.getUser("user");
        const targetUserId = await interaction.guild.members.fetch(
          targetUser.id
        );
        const duration = interaction.options.getNumber("duration") * 60 * 1000;
        if (
          !interaction.member.permissions.has(PermissionFlagsBits.MuteMembers)
        ) {
          return alert.errorAlert(
            "You don't have enough perms to mute the member.\nRequired perms:`Mute Members."
          );
        }
        if (targetUserId && !duration) {
          muteMember.mute(targetUserId);
          return alert.successAlert(
            `Muted user ${targetUserId}, duration: 1 minute`
          );
        } else if (targetUserId && duration) {
          muteMember.muteWithDuration(targetUserId, duration);
          return alert.successAlert(
            `Muted user ${targetUserId} for duration: ${duration / 60000} ${
              duration / 60 > 1 ? "minutes" : "minute"
            }`
          );
        }

      case "remove":
        const removeTargetUser = interaction.options.getUser("target");
        const removeTargetUserId = await interaction.guild.members.fetch(
          removeTargetUser.id
        );
        if (
          !interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)
        ) {
          return alert.errorAlert(
            "You don't have enough perms to remove the timeout.\nRequired perms:`Manage Roles."
          );
        }
        muteMember.unmute(removeTargetUserId);
        return alert.successAlert(`Removed timeout for ${removeTargetUser}`);

      default:
        return alert.errorAlert("Invalid subcommand.");
    }
  },
};
