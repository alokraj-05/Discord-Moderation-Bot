const {
  SlashCommandBuilder,
  PermissionsBitField,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");
const Alert = require("../../utils/alert");

const createModLog = async (interaction) => {
  const alert = new Alert(interaction);
  const guild = interaction.guild;

  if (
    !interaction.guild.members.me.permissions.has(
      PermissionFlagsBits.Administrator
    )
  ) {
    return await alert.errorAlertWithTitle(
      `I don't have Admin perms to create mod log for the server`,
      `Perms issue`
    );
  }
  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    await alert.errorAlert(
      `You don't have enough perms to run this command\nRequired permissions: \`Administrator\``
    );
  }

  await alert.successAlert(`Successfully created Sergio mod log`);
  try {
    const modCategory = await guild.channels.create({
      name: "Sergio-ModLog",
      type: 4,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
      ],
    });
    await guild.channels.create({
      name: "admin-log",
      parent: modCategory.id,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
      ],
    });
    await guild.channels.create({
      name: "join-log",
      parent: modCategory.id,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
      ],
    });
    await guild.channels.create({
      name: "roles-updates",
      parent: modCategory.id,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
      ],
    });
    await guild.channels.create({
      name: "members-updates",
      parent: modCategory.id,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
      ],
    });
    await guild.channels.create({
      name: "leave-log",
      parent: modCategory.id,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
      ],
    });
    await guild.channels.create({
      name: "vc-log",
      parent: modCategory.id,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
      ],
    });
    await guild.channels.create({
      name: "message-delete",
      parent: modCategory.id,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
      ],
    });
  } catch (error) {
    console.error(error);
    await alert.errorAlert(
      "An error occurred while configuring mod categories."
    );
  }
};

async function removeModLog(interaction) {
  const alert = new Alert(interaction);

  if (
    !interaction.guild.members.me.permissions.has(
      PermissionFlagsBits.Administrator
    )
  ) {
    return alert.errorAlertWithTitle(
      `I don't have admin perms to remove Sergio-ModLog`,
      `Perms issue`
    );
  }

  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    return alert.errorAlert(`You don't have admin perms to setup mod log.`);
  }

  await alert.errorAlert(`Deleting Sergio mod log`);
  try {
    const searchCategory = interaction.guild.channels.cache.find(
      (channel) => channel.name === "Sergio-ModLog" && channel.type === 4
    );
    if (!searchCategory) {
      return alert.errorAlert("Mod log not found.");
    }

    const channels = interaction.guild.channels.cache.filter(
      (channel) => channel.parentId === searchCategory.id
    );
    for (const [channelId, channel] of channels) {
      await channel.delete();
    }
    await searchCategory.delete();
  } catch (error) {
    console.error(error);
    return alert.errorAlert(
      `There is some issue while removing mod log. Please try again later.`
    );
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("modlog")
    .setDescription("Setup mod log for the server.")
    .addSubcommand((cmd) =>
      cmd.setName("enable").setDescription("Enable Mod log for the server")
    )
    .addSubcommand((cmd) =>
      cmd.setName("disable").setDescription("Disable Mod log for the server")
    ),
  async execute(interaction) {
    const alert = new Alert(interaction);
    const sub = interaction.options.getSubcommand();
    const option = interaction.options.getString("action");

    switch (sub) {
      case "enable":
        return await createModLog(interaction);
      case "disable":
        return await removeModLog(interaction);
      default:
        return alert.errorAlert(`Invalid interaction.`);
    }
  },
};
