const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription(
      "Get the bot statistics including server count, member count, and shard count."
    ),
  async execute(interaction) {
    let totalGuilds = 0;
    let totalMembers = 0;
    let shardCount = 1;

    if (interaction.client.shard && interaction.client.shard.count > 0) {
      // If the bot is sharded
      const guildCounts = await interaction.client.shard.fetchClientValues(
        "guilds.cache.size"
      );
      const memberCounts = await interaction.client.shard.broadcastEval(
        (client) =>
          client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
      );
      totalGuilds = guildCounts.reduce((acc, count) => acc + count, 0);
      totalMembers = memberCounts.reduce((acc, count) => acc + count, 0);
      shardCount = interaction.client.shard.count;
    } else {
      // If the bot is not sharded
      totalGuilds = interaction.client.guilds.cache.size;
      totalMembers = interaction.client.guilds.cache.reduce(
        (acc, guild) => acc + guild.memberCount,
        0
      );
    }

    const statsEmbed = new EmbedBuilder()
      .setColor(0x00ae86)
      .setTitle("Bot Statistics")
      .addFields(
        { name: "Total Servers", value: `${totalGuilds}`, inline: true },
        { name: "Total Members", value: `${totalMembers}`, inline: true },
        { name: "Total Shards", value: `${shardCount}`, inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [statsEmbed] });
  },
};
