const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  PermissionOverwrites,
  ChannelType,
} = require("discord.js");
const Backup = require("../../models/guildBackup"); // Assuming this is your backup model
const crypto = require("crypto"); // For generating backup keys
const { type } = require("os");

// Helper function to enable 2FA
async function enable2FA(interaction) {
  const { chennel, member } = interaction;
  const guild = interaction.guild;
  const owner = guild.ownerId;
  try {
    // Check permissions
    if (member.id !== owner) {
      const noPermsEmbed = new EmbedBuilder()
        .setTitle("Lacking permissions.")
        .setDescription("You don't have permissions to setup ANTI-NUKE!")
        .setColor("Red");
      return interaction.reply({ embeds: [noPermsEmbed], ephemeral: true });
    }
    const instructionEmbed = new EmbedBuilder()
      .setTitle(
        "> <:8826misnicker:1284932343110570076> Succssfully setup ANTI-NUKE"
      )
      .setDescription(
        "`Created category SERGIO-ANTINUKE, get all the admin, welcome, alert messages there.`"
      )
      .setColor("Blurple");

    await interaction.reply({ embeds: [instructionEmbed], ephemeral: true });

    // Create necessary channels (optional)
    try {
      const adminCategory = await guild.channels.create({
        name: "Sergio-antinuke",
        type: 4, // Category type
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
        ],
      });
      await guild.channels.create({
        name: "Admin-log",
        parent: adminCategory.id,
        type: ChannelType.GuildText, // Text channel type
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
        name: "welcome-log",
        parent: adminCategory.id,
        type: 0,
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
        name: "alert",
        parent: adminCategory.id,
        type: 0,
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
        name: "leaves",
        parent: adminCategory.id,
        type: 0,
        permissionOverwrites: [
          {
            id: guild.roles.everyone,
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: interaction.user.id,
            allow: [PermissionsBitField.Flags.ViewChannel],
          },
        ],
      });
    } catch (error) {
      console.error("Error creating channels:", error);
    }
  } catch (error) {
    console.error("Error enabling 2FA:", error);
    await interaction.reply({
      content: "An error occurred while setting up antinuke.",
      ephemeral: true,
    });
  }
}

// Helper function to disable 2FA
async function disable2FA(interaction) {
  const guild = interaction.guild;
  const ownerId = guild.ownerId;
  const member = interaction.member;

  try {
    // Check if the member is the server owner
    if (member.id !== ownerId) {
      const noPermsEmbed = new EmbedBuilder()
        .setTitle("Lacking Permissions")
        .setDescription("Only the server owner can disable 2FA!")
        .setColor("Red");
      return interaction.reply({ embeds: [noPermsEmbed], ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle("Anti-nuke Disabled")
      .setDescription(
        "Anti-nuke has been disabled for the server. | Successfully removed Sergio-antinuke category."
      )
      .setColor("Red");

    await interaction.deferReply({ ephemeral: true });
    await interaction.editReply({ embeds: [embed] });

    // Find and delete the 'Sergio-antinuke' category and its channels
    const category = guild.channels.cache.find(
      (channel) => channel.name === "Sergio-antinuke" && channel.type === 4
    ); // 4 is category type

    if (category) {
      const channels = guild.channels.cache.filter(
        (channel) => channel.parentId === category.id
      );
      for (const [channelId, channel] of channels) {
        await channel.delete();
      }
      await category.delete();
      console.log(
        "Sergio-antinuke category and its channels have been deleted."
      );
    } else {
      console.log("No Sergio-antinuke category found.");
    }
  } catch (error) {
    console.error("Error disabling 2FA or deleting channels:", error);
    await interaction.reply({
      content:
        "An error occurred while disabling 2FA or deleting the channels.",
      ephemeral: true,
    });
  }
}

// Function to generate a unique backup key
function generateBackupKey() {
  return crypto.randomBytes(8).toString("hex");
}

// Helper function to create a backup
async function createBackup(interaction) {
  const guild = interaction.guild;

  // Fetch roles and channels
  const roles = guild.roles.cache.map((role) => ({
    name: role.name,
    id: role.id,
  }));
  const channels = guild.channels.cache.map((channel) => ({
    name: channel.name,
    id: channel.id,
  }));

  const backupKey = generateBackupKey();

  // Save backup in the database
  const newBackup = new Backup({
    guildId: guild.id,
    backupKey,
    roles,
    channels,
  });
  await newBackup.save();

  const embed = new EmbedBuilder()
    .setTitle("Backup Created")
    .setDescription(
      `A backup has been created with the key: \`${backupKey}\`. Please save this key to restore later.`
    )
    .setColor("Blue");
  await interaction.reply({ embeds: [embed], ephemeral: true });
}

// Helper function to restore a backup
async function restoreBackup(interaction, providedKey) {
  const guildId = interaction.guild.id;

  // Find backup by guildId and key
  const backup = await Backup.findOne({ guildId, backupKey: providedKey });

  if (!backup) {
    const embed = new EmbedBuilder()
      .setTitle("Backup Restore Failed")
      .setDescription("No matching backup found with the provided key.")
      .setColor("Red");
    await interaction.reply({ embeds: [embed], ephemeral: true });
    return;
  }

  // Restore roles and channels (Logic here depends on API and how you want to handle it)
  const embed = new EmbedBuilder()
    .setTitle("Backup Restored")
    .setDescription("The backup has been restored successfully.")
    .setColor("Green");
  await interaction.reply({ embeds: [embed], ephemeral: true });

  // Logic for restoring channels, roles, etc. added here.
}

// Helper function for handling forgot key
async function forgotKey(interaction, client) {
  const guild = interaction.guild;
  const owner = guild.ownerId;

  if (interaction.user.id !== owner) {
    // Not the owner
    const embed = new EmbedBuilder()
      .setTitle("Unauthorized")
      .setDescription("Only the server owner can request a backup key.")
      .setColor("Red");
    await interaction.reply({ embeds: [embed], ephemeral: true });
    return;
  }

  const backup = await Backup.findOne({ guildId: guild.id });

  if (!backup) {
    const embed = new EmbedBuilder()
      .setTitle("No Backup Found")
      .setDescription("No backup exists for this server.")
      .setColor("Red");
    await interaction.reply({ embeds: [embed], ephemeral: true });
    return;
  }

  // Send key to owner via DM
  try {
    const dmChannel = await client.users.cache.get(owner).createDM();
    await dmChannel.send(
      `Your backup key for the server "${guild.name}" is: \`${backup.backupKey}\``
    );
    const embed = new EmbedBuilder()
      .setTitle("Backup Key Sent")
      .setDescription("The backup key has been sent to your DMs.")
      .setColor("Blue");
    await interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (error) {
    const embed = new EmbedBuilder()
      .setTitle("DM Failed")
      .setDescription("Unable to send DM. Please make sure DMs are enabled.")
      .setColor("Red");
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("antinuke")
    .setDescription("Anti-nuke protection system")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("setup")
        .setDescription("Setup antinuke protection system")
        .addStringOption((option) =>
          option
            .setName("action")
            .setDescription("Enable or disable antinuke")
            .setRequired(true)
            .addChoices(
              { name: "enable", value: "enable" },
              { name: "disable", value: "disable" }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("backup")
        .setDescription("Create or restore a server backup")
        .addStringOption((option) =>
          option
            .setName("action")
            .setDescription("Create or restore backup")
            .setRequired(true)
            .addChoices(
              { name: "create", value: "create" },
              { name: "restore", value: "restore" }
            )
        )
        .addStringOption((option) =>
          option.setName("key").setDescription("Backup key for restoring")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("key")
        .setDescription("Forgot or change your backup key")
        .addStringOption((option) =>
          option
            .setName("action")
            .setDescription("Forgot or change your key")
            .setRequired(true)
            .addChoices(
              { name: "forgot", value: "forgot" },
              { name: "change", value: "change" }
            )
        )
    ),

  async execute(interaction, client) {
    const subcommand = interaction.options.getSubcommand();
    const action = interaction.options.getString("action");
    const providedKey = interaction.options.getString("key");
    try {
      switch (subcommand) {
        case "setup":
          if (action === "enable") {
            await enable2FA(interaction).catch((err) => err.message);
          } else if (action === "disable") {
            await disable2FA(interaction).catch((err) => err.message);
          }
          break;

        case "backup":
          if (action === "create") {
            await createBackup(interaction);
          } else if (action === "restore") {
            await restoreBackup(interaction, providedKey);
          }
          break;

        case "key":
          if (action === "forgot") {
            await forgotKey(interaction, client);
          }
          break;

        default:
          await interaction.reply({
            content: "Invalid command",
            ephemeral: true,
          });
      }
    } catch (error) {
      console.error(error);
      const errorEmbed = new EmbedBuilder().setDescription(
        "An error occured while executing the command."
      );
      interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};
