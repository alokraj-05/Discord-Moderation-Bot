const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getPrefix } = require('../../prefix/getPrefix'); // Fetching prefix from DB

// Sample command modules (you can adjust this as needed)
const modules = [
  { name: 'Moderation', commands: ['ban', 'kick', 'mute(timeout)', 'bannedUser(fb)', 'unban(ub)', 'lock', 'unlock'] },
  { name: 'General', commands: ['ping', 'avatar', 'serverinfo(si)', 'userinfo(ui)', 'changenickname(sn)'] },
  { name: 'Welcome', commands: ['welcome', 'goodbye'] },
  { name: 'Antinuke', commands: ['antinuke', 'setup', 'backup', 'restore', 'key'] },
  { name: 'extra', commands: ['githubuser (gitu)', 'setprefix(sp)', 'stats'] }
];

module.exports = {
  name: 'help',
  description: 'Displays help information for the bot commands.',
  async execute(message, args, client) {
    const prefix = await getPrefix(message.guild.id); // Fetch prefix dynamically from DB

    // If a specific module is requested
    if (args.length > 0) {
      const moduleName = args[0].toLowerCase();
      const module = modules.find(mod => mod.name.toLowerCase() === moduleName);

      if (module) {
        // Show specific module with commands
        const embed = new EmbedBuilder()
          .setColor('Blurple')
          .setTitle(`${module.name} Commands`)
          .setDescription(`\`${module.commands.join(', ')}\``)
          .setFooter({ text: `Use ${prefix}help <module> for more details on a module!` });

        return message.channel.send({ embeds: [embed] });
      } else {
        // Module not found
        const errorEmbed = new EmbedBuilder()
          .setColor('Red')
          .setDescription(`<:1568midubious:1284932090109886464> No such module found: \`${args[0]}\`.`)
          .setFooter({ text: `Use ${prefix}help to view available modules.` });

        return message.channel.send({ embeds: [errorEmbed] });
      }
    }

    // Help with modules list
    let page = 0;
    const pages = modules.length;

    // Create the help embed with only module names
    const createEmbed = () => {
      const embed = new EmbedBuilder()
        .setColor('Blurple')
        .setTitle('<:6733misquish:1284932219588182121> Help Menu')
        .setDescription(`Prefix: \`${prefix}\`\nAvailable Modules:`)
        .addFields(modules.map((mod, i) => ({
          name: `${i + 1}. ${mod.name}`,
          value: `Use \`${prefix}help ${mod.name.toLowerCase()}\` to view commands.`,
          inline: false,
        })))
        .setFooter({ text: `Page ${page + 1} of ${pages}` });
      return embed;
    };

    // Buttons for pagination and actions
    const buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('prev')
          .setLabel('◀️')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(page === 0),
        new ButtonBuilder()
          .setCustomId('next')
          .setLabel('▶️')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(page === pages - 1),
        new ButtonBuilder()
          .setCustomId('cross')
          .setLabel('❌')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setLabel('Invite')
          .setStyle(ButtonStyle.Link)
          .setURL('https://discord.com/oauth2/authorize?client_id=1268482584103354398'),
        new ButtonBuilder()
          .setLabel('Server')
          .setStyle(ButtonStyle.Link)
          .setURL('https://discord.gg/99ugxRgyk5')
      );

    // Send the initial help message
    const helpMessage = await message.channel.send({
      embeds: [createEmbed()],
      components: [buttons],
    });

    // Collector for button interactions
    const filter = (interaction) => interaction.user.id === message.author.id;
    const collector = helpMessage.createMessageComponentCollector({
      filter,
      time: 60000, // 1 minute timeout
    });

    collector.on('collect', async (interaction) => {
      if (interaction.customId === 'next') {
        page++;
      } else if (interaction.customId === 'prev') {
        page--;
      } else if (interaction.customId === 'cross') {
        // Delete the message and stop collector
        await helpMessage.delete().catch(() => { }); // Avoid unknown message error
        return collector.stop();
      }

      // Update the message with the new page
      await interaction.update({
        embeds: [createEmbed()],
        components: [
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('prev')
                .setLabel('◀️')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === 0),
              new ButtonBuilder()
                .setCustomId('next')
                .setLabel('▶️')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === pages - 1),
              new ButtonBuilder()
                .setCustomId('cross')
                .setLabel('❌')
                .setStyle(ButtonStyle.Danger),
              new ButtonBuilder()
                .setLabel('Invite')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.com/oauth2/authorize?...'), // Add your invite link
              new ButtonBuilder()
                .setLabel('Server')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.gg/...') // Add your server link
            ),
        ],
      });
    });

    collector.on('end', () => {
      if (!helpMessage.deleted) {
        helpMessage.edit({ components: [] }).catch(() => { });
      }
    });
  },
};
