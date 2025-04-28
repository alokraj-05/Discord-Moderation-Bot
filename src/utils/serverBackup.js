const { ChannelType } = require("discord.js");
const crypto = require("crypto");
const Backup = require("../models/guildBackup");
class ServerBackup {
  async createBackup(interaction) {
    const guild = interaction.guild;

    await interaction.reply({
      content: `⌛ Creating backup, please wait...`,
      ephemeral: true,
    });

    const roles = guild.roles.cache
      .filter((role) => role.id !== guild.id && !role.managed)
      .sort((a, b) => b.position - a.position)
      .map((role) => ({
        name: role.name,
        color: role.hexColor,
        permissions: role.permissions.toArray(),
        position: role.position,
        hoist: role.hoist,
        mentionable: role.mentionable,
      }));

    const categories = guild.channels.cache
      .filter((c) => c.type === ChannelType.GuildCategory)
      .sort((a, b) => a.position - b.position)
      .map((category) => {
        const childChannels = guild.channels.cache
          .filter((ch) => ch.parentId === category.id)
          .sort((a, b) => a.position - b.position)
          .map((channel) => ({
            name: channel.name,
            type: channel.type,
            position: channel.position,
            userLimit: channel.userLimit || 0,
            parent: category.name,
            permissionOverwrites: channel.permissionOverwrites.cache.map(
              (ow) => ({
                id: ow.id,
                allow: ow.allow.toArray(),
                deny: ow.deny.toArray(),
                type: ow.type,
              })
            ),
          }));
        return {
          name: category.name,
          position: category.position,
          channels: childChannels,
        };
      });
    const backupKey = crypto.randomBytes(8).toString("hex");

    const newBackup = new Backup({
      guildId: guild.id,
      roles,
      categories,
      backupKey,
    });

    try {
      await newBackup.save();
      return interaction.editReply(
        `✅ Backup created! Your key is \`${backupKey}\`. Keep it safe.`
      );
    } catch (err) {
      console.error(err);
      return interaction.reply(`❌ Error saving backup.`);
    }
  }

  async restoreBackup(key, interaction) {
    const guild = interaction.guild;
    const backup = await Backup.findOne({ backupKey: key });
    if (!backup) {
      return interaction.followUp({
        content: `❌ No backup found with this key.`,
      });
    }
    const channelLength = backup.categories
      .map((ch) => ch.channels.length)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const totalSteps =
      backup.roles.length + backup.categories.length + channelLength;
    let currentStep = 0;

    async function updateProgress() {
      const percent = Math.floor((currentStep / totalSteps) * 100);
      const filled = Math.floor(percent / 10);
      const empty = 10 - filled;
      const progress = `[${"█".repeat(filled)}${"░".repeat(
        empty
      )}] ${percent}%`;
      await interaction.editReply(`Restoring Backup...\n${progress}`);
    }
    const sortedRoles = backup.roles.sort((a, b) => a.position - b.position);

    try {
      for (const roleData of backup.roles) {
        const existingRole = guild.roles.cache.find(
          (r) => r.name === roleData.name
        );
        if (!existingRole) {
          await guild.roles.create({
            name: roleData.name,
            color: roleData.color,
            permissions: roleData.permissions || [],
            reason: "Restoring backup",
          });
        }
        currentStep++;
        await updateProgress();
      }

      // Restore categories and channels
      for (const categoryData of backup.categories) {
        // Find or create category
        let category = guild.channels.cache.find(
          (ch) =>
            ch.name === categoryData.name &&
            ch.type === ChannelType.GuildCategory
        );

        if (!category) {
          category = await guild.channels.create({
            name: categoryData.name,
            type: ChannelType.GuildCategory,
            reason: "Restoring backup",
          });
        }
        currentStep++;
        await updateProgress();
        // Restore channels inside category
        for (const chData of categoryData.channels) {
          const existingChannel = guild.channels.cache.find(
            (c) =>
              c.name === chData.name &&
              c.type === chData.type &&
              c.parentId === category.id
          );
          if (existingChannel) continue; // Channel already exists in correct place

          if (chData.type === ChannelType.GuildCategory) continue; // Skip nested categories

          await guild.channels.create({
            name: chData.name,
            type: chData.type,
            parent: category.id,
            userLimit: chData.userLimit || 0,
            position: chData.position,
            permissionOverwrites: chData.permissionOverwrites?.map((ow) => ({
              id: ow.id,
              allow: ow.allow,
              deny: ow.deny,
              type: ow.type,
            })),
            reason: "Restoring backup",
          });
          currentStep++;
          await updateProgress();
        }
      }

      return interaction.followUp({
        content: "✅ Backup restored successfully!",
        ephemeral: false,
      });
    } catch (error) {
      console.error(`Error recovering backup for ${guild.name}:`, error);
      return interaction.editReply({
        content: "Failed to restore backup. Try again later.",
        ephemeral: true,
      });
    }
  }
}
module.exports = ServerBackup;
