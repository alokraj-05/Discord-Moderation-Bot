const {
  ChannelType,
  SlashCommandBuilder,
  ActionRow,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

const ServerBackup = require("../../utils/serverBackup");

const serverBackup = new ServerBackup();

async function cleanGuild(guild) {
  await Promise.all(
    guild.channels.cache.map((c) => c.delete().catch(() => {}))
  );
  await Promise.all(
    guild.roles.cache
      .filter((r) => r.id !== guild.id && !r.managed)
      .map((r) => r.delete().catch(() => {}))
  );
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("antinuke")
    .setDescription("Antinuke backup system.")
    .addSubcommand((sub) =>
      sub
        .setName("backup")
        .setDescription("Backup your server channels & roles")
    )
    .addSubcommand((sub) =>
      sub
        .setName("restore")
        .setDescription("Restore server backup")
        .addStringOption((key) =>
          key
            .setName("key")
            .setDescription("Provide the backup key.")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const executor = interaction.member;
    console.log("Executor: ", executor.id);
    const owner = interaction.guild.ownerId;
    console.log(`Owner: ${owner}`);
    if (executor.id !== owner)
      return interaction.reply({
        content: `Only Guild owner can backup or restore the server data [due to security concerns].`,
        ephemeral: true,
      });

    const sub = interaction.options.getSubcommand();
    const key = interaction.options.getString("key");
    switch (sub) {
      case "backup": {
        await serverBackup.createBackup(interaction);
        break;
      }
      case "restore": {
        const confirmRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("confirm_restore")
            .setLabel("✅ Confirm Restore")
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId("cancel_restore")
            .setLabel("❌ Cancel")
            .setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({
          content: `⚠️ **Warning!**\nRestoring a backup will:\n- Wipe current channels (if fresh)\n- Wipe roles (if fresh)\n- Recreate channels, roles, categories.\n\nAre you sure you want to continue?`,
          components: [confirmRow],
          ephemeral: true,
        });

        const collector = interaction.channel.createMessageComponentCollector({
          time: 15000,
        });

        collector.on("collect", async (btnInteraction) => {
          if (btnInteraction.user.id !== interaction.user.id) return;

          if (btnInteraction.customId === "confirm_restore") {
            await btnInteraction.update({
              content: "✅ Restoration started!",
              components: [],
            });
            await serverBackup.restoreBackup(key, interaction);
            collector.stop();
          } else if (btnInteraction.customId === "cancel_restore") {
            await btnInteraction.update({
              content: "❌ Backup restoration canceled.",
              components: [],
            });
            collector.stop();
          }
        });

        collector.on("end", (collected) => {
          if (collected.size === 0) {
            interaction.editReply({
              content: "⌛ Confirmation timed out.",
              components: [],
            });
          }
        });

        break;
      }
    }
  },
};
