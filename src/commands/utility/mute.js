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
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mute a server member, default duration 1 minute.")
    .addUserOption((usr) =>
      usr.setName("user").setDescription("Select a user").setRequired(true)
    )
    .addNumberOption((duration) =>
      duration.setName("duration").setDescription("Set duration in minutes.")
    )
    .addStringOption((msg) =>
      msg
        .setName("reason")
        .setDescription("Provide a reason to mute the member.")
    ),
  async execute(interaction) {
    const alert = new Alert(interaction);
    const muteMember = new MuteUser(interaction);
    const targetUser = interaction.options.getUser("user");
    const targetUserId = await interaction.guild.members.fetch(targetUser.id);
    const duration = interaction.options.getNumber("duration") * 60 * 1000;

    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.MuteMembers
      )
    ) {
      return alert.errorAlert(
        "I don't have enough permissions to mute the member.\nRequired perms:`Mute members`"
      );
    }

    if (!interaction.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
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
      alert.successAlert(
        `Muted user ${targetUserId} for duration: ${duration / 60000} ${
          duration / 60 > 1 ? "minutes" : "minute"
        }`
      );
    }
  },
};
