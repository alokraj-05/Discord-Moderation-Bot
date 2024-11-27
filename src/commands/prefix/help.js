const {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ComponentType,
} = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["Help", "H", "ch"],
  description: "Get a list of all available commands.",
  async execute(message) {
    const avatar = message.client.user.displayAvatarURL({ dynamic: true });
    const botUser = await message.client.users.fetch(message.client.user.id, {
      force: true,
    });
    const botProfile = await botUser.fetch();
    const bannerURL = botProfile.bannerURL({ size: 1024 });
    const embed = new EmbedBuilder()
      .setTitle("Help")
      .setDescription(
        `> We offer you a list of method to secure your server and make ineractive with other commands.`
      )
      .addFields(
        {
          name: "<:9961blurpleshieldfull:1292733201185247253> Security",
          value: `- Moderation\n- Antinuke\n- Automod`,
          inline: true,
        },
        {
          name: "<:3067blurplesprout:1292733124882599938> General",
          value: `- General\n- Extra\n- Welcomer`,
          inline: true,
        },
        {
          name: "<:4156blurpleflame:1292733333591035976> Social",
          value: `- Github\n- Youtube\n- Twitch`,
          inline: true,
        },
        {
          name: "<:1783blurplemail:1292732975812706315> Support",
          value: `- [Website](https://sergio-docs.vercel.app/ )\n- [Server](https://discord.gg/99ugxRgyk5)`,
          inline: true,
        }
      )
      .setColor("#002540")
      .setAuthor({ iconURL: avatar, name: "Sergio" })
      .setImage(bannerURL);

    const row = new StringSelectMenuBuilder()
      .setCustomId(message.id)
      .setPlaceholder("Get all the available commnds")
      .addOptions([
        new StringSelectMenuOptionBuilder()
          .setLabel("Moderation")
          .setValue("moderation")
          .setDescription("Get moderation commands")
          .setEmoji(`<:9961blurpleshieldfull:1292733201185247253>`),
        new StringSelectMenuOptionBuilder()
          .setLabel("Antinuke")
          .setValue("antinuke")
          .setDescription("Get all the anitnuke commands")
          .setEmoji(`<:2870blurpletools:1292733083459784704>`),

        new StringSelectMenuOptionBuilder()
          .setLabel("Automod")
          .setValue("automod")
          .setDescription("Get all the Automod commands")
          .setEmoji(`<:2105blurplepalette:1292733036282253393>`),
        new StringSelectMenuOptionBuilder()
          .setLabel("General")
          .setValue("general")
          .setDescription("Get all the General commands")
          .setEmoji(`<:3067blurplesprout:1292733124882599938>`),
        new StringSelectMenuOptionBuilder()
          .setLabel("Extra")
          .setValue("extra")
          .setDescription("Get all the Extra commands")
          .setEmoji(`<:7856blurplediamond:1292733602261504114>`),
        new StringSelectMenuOptionBuilder()
          .setLabel("Welcomer")
          .setValue("welcomer")
          .setDescription("Get all the Welcomer commands")
          .setEmoji(`<:7100blurpleheart:1292733297507438604>`),
        new StringSelectMenuOptionBuilder()
          .setLabel("Social")
          .setValue("social")
          .setDescription("Get all the Social commands")
          .setEmoji(`<:4156blurpleflame:1292733333591035976>`),
      ]);
    const selectMenuRow = new ActionRowBuilder().addComponents(row);
    const firstReply = await message.reply({
      embeds: [embed],
      components: [selectMenuRow],
    });

    const collector = firstReply.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 60_000,
      filter: (i) =>
        i.user.id === message.author.id && i.customId === message.id,
    });

    collector.on("collect", async (interaction) => {
      if (interaction.user.id !== message.author.id) {
        return interaction.reply({
          content: "You can't interact with this menu.",
          ephemeral: true,
        });
      }
      let updatedEmbed;
      switch (interaction.values[0]) {
        case "moderation":
          updatedEmbed = new EmbedBuilder()
            .setAuthor({ name: "Sergio", iconURL: avatar })
            .setTitle("<:9961blurpleshieldfull:1292733201185247253> Moderation")
            .setDescription(
              "> We offer you a list of moderation command with prefix and slash"
            )
            .addFields(
              {
                name: "`S!`Prefix",
                value: `- ban\n- unban\n- kick\n- mute\n- unmute\n- lock\n- unlock\n- fetchban{fb}`,
                inline: true,
              },
              {
                name: "`/`Slash",
                value: `- ban\n- kick\n- timeout\n- lock\n- unlock`,
                inline: true,
              }
            )
            .setColor("#002540")
            .setImage(bannerURL);
          break;
        case "antinuke":
          updatedEmbed = new EmbedBuilder()
            .setAuthor({ name: "Sergio", iconURL: avatar })
            .setTitle("<:2870blurpletools:1292733083459784704> Antinuke")
            .setDescription(
              "> Currently we are providing a set of antinuke protection as we cover most in automod"
            )
            .addFields(
              {
                name: "**Alert category**",
                value: `**Sergio-antinuke**\n__Get alert messages on any kind of activity includes__\n-# admin-log\n-# welcome-log\n-# alert\n-# leaves`,
                inline: true,
              },
              {
                name: "**Backup**",
                value: `-# Keep a backup of your server where you can store you data and in kind of guild loss you can recover the data to get your server settings (i.e. channels, roles settings...) back`,
                inline: true,
              },
              {
                name: "**Restore**",
                value: `-# Restore your server data.`,
                inline: true,
              },
              {
                name: "**Delete**",
                value: `-# Request for your data deletion. Only server owner can request for data deletion.`,
                inline: true,
              },
              {
                name: "**Key**",
                value: `-# Get the restore key in case you forgot or lost the key. __ONLY SERVER OWNER HAVE RIGHT TO ASK FOR NEW KEY__`,
                inline: true,
              }
            )
            .setColor("#002540")
            .setImage(bannerURL);
          break;
        case "automod":
          updatedEmbed = new EmbedBuilder()
            .setAuthor({ name: "Sergio", iconURL: avatar })
            .setTitle("<:2105blurplepalette:1292733036282253393> Automod")
            .setDescription(
              "> Use Sergio's anitnuke to safeguard your server and restrict unwanted activity."
            )
            .addFields(
              {
                name: "**mention-spam**",
                value: `-# If the user exceeds the number of mention in particular message it will get blocked!`,
                inline: true,
              },
              {
                name: "**rate-limit**",
                value: `-# Limit the number of messages in an interval of time.`,
                inline: true,
              },
              {
                name: "**block-links**",
                value: `-# Block links for all the channel/user even if they have admin perms.\n-# __no restrictions on server owner__`,
                inline: true,
              },
              {
                name: "**flagged-words**",
                value: `-# Block profanity, sexual content, slurs`,
                inline: true,
              },
              {
                name: "**keywords**",
                value: `-# Block a set of words (if there is more than one word seprate them with comma).`,
                inline: true,
              },
              {
                name: "**spam-messages**",
                value: `-# Block potential spams.`,
                inline: true,
              }
            )
            .setColor("#002540")
            .setImage(bannerURL);
          break;
        case "general":
          updatedEmbed = new EmbedBuilder()
            .setAuthor({ name: "Sergio", iconURL: avatar })
            .setTitle("<:2105blurplepalette:1292733036282253393> General")
            .setDescription("> General commands for regular use and fun.")
            .addFields(
              {
                name: "**ping**",
                value: `-# Get user ping! __available in both prefix and slash__`,
                inline: true,
              },
              {
                name: "**avatar**",
                value: `-# Get user avatar \`<prefix>pfp\``,
                inline: true,
              },
              {
                name: "**Server Info**",
                value: `-# Use \`<prefix>si\` to get server info`,
                inline: true,
              },
              {
                name: "**User Info**",
                value: `-# Use \`<prefix>ui\` to get user info`,
                inline: true,
              },
              {
                name: "**keywords**",
                value: `-# Block a set of words (if there is more than one word seprate them with comma).`,
                inline: true,
              },
              {
                name: "**Set/Change name**",
                value: `-# use\`<prefix>sn\` to set new name for user.`,
                inline: true,
              }
            )
            .setColor("#002540")
            .setImage(bannerURL);
          break;
        case "extra":
          updatedEmbed = new EmbedBuilder()
            .setAuthor({ name: "Sergio", iconURL: avatar })
            .setTitle("<:2105blurplepalette:1292733036282253393> Extra")
            .setDescription(
              "> Extra Commands to customize your experience as needed."
            )
            .addFields(
              {
                name: "**github user**",
                value: `-# Use: \`gitu github_username\` Fetch user profile data.`,
                inline: true,
              },
              {
                name: "**setPrefix**",
                value: `-# Set custom prefix.\nSyntax: <prefix>sp <newPrefix>`,
                inline: true,
              },
              {
                name: "**embed**",
                value: `-# Create a embed message.`,
                inline: true,
              },
              {
                name: "**Purge**",
                value: `-# Purge upto 100 messages.`,
                inline: true,
              },
              {
                name: "**Create role**",
                value: `-# Create role __available in slash cmd__`,
                inline: true,
              },
              {
                name: "**Join Roles**",
                value: `-# Set default join role for the server.`,
                inline: true,
              },
              {
                name: "**Reaction Roles**",
                value: `-# Setup reaction role for the server.`,
                inline: true,
              }
            )
            .setColor("#002540")
            .setImage(bannerURL);
          break;
        case "welcomer":
          updatedEmbed = new EmbedBuilder()
            .setAuthor({ name: "Sergio", iconURL: avatar })
            .setTitle("<:2105blurplepalette:1292733036282253393> Welcomer")
            .setDescription("> Setup welcome/Leave message.")
            .addFields(
              {
                name: "**Welcome message**",
                value: `-# Set welcome message for the new user`,
                inline: true,
              },
              {
                name: "**Leaves**",
                value: `-# Get members updates who left the server.`,
                inline: true,
              }
            )
            .setColor("#002540")
            .setImage(bannerURL);
          break;
        case "social":
          updatedEmbed = new EmbedBuilder()
            .setAuthor({ name: "Sergio", iconURL: avatar })
            .setTitle(
              "<:2105blurplepalette:1292733036282253393> Social notifications"
            )
            .setDescription(
              "> Setup social notifications to get update on your channel."
            )
            .addFields(
              {
                name: "**Github**",
                value: `-# Set github user update log to specific channel.`,
                inline: true,
              },
              {
                name: "**Youtube**",
                value: `-# Setup youtube update log to specific channel.`,
                inline: true,
              }
            )
            .setColor("#002540")
            .setImage(bannerURL);
          break;
        default:
          updatedEmbed = embed;
          break;
      }
      await interaction.update({ embeds: [updatedEmbed] });
    });
    collector.on("end", () => {});
  },
};
