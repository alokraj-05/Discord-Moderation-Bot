const { EmbedBuilder } = require("discord.js");
const GuildConfigData = require("../../models/fetchGuild"); // Import the schema
require("dotenv").config();

module.exports = {
  name: "si",
  description: "Displays information about the guild.",
  async execute(message) {
    try {
      // If you want to this command to be executed by bot owner only then un comment the below code

      // const botOwnerId = process.env.BOT_OWNER_ID;
      // const memberId = message.author.id;

      // const memberEmbed = new EmbedBuilder().setDescription(
      //   "Only the bot's owner can fetch guild information."
      // );

      // // Check if the user is the bot owner
      // if (memberId !== botOwnerId) {
      //   return message.reply({ embeds: [memberEmbed] });
      // }


      // Fetch guild data from the database
      const guildData = await GuildConfigData.findOne({
        guildId: message.guild.id,
      });

      // Check if the data exists for the guild
      if (!guildData) {
        const noDataEmbed = new EmbedBuilder()
          .setDescription("No data found for this guild.")
          .setColor("Red");
        return message.reply({ embeds: [noDataEmbed] });
      }

      const description = `
      **__ABOUT__**

<a:verifiedBlueTick:1284197344321081385> **Guild Name**: ${guildData.guildName}
**Guild ID**: ${guildData.guildId}
<:38596ownercrown:1284208581796696207> **Owner**: ${guildData.guildOwnerName}
<a:73288animatedarrowred:1284206642816352386> **Total Roles**: ${guildData.totalRoles
        }
<:18341calendar:1284208071639568435> **Guild Created Date**: <t:${Math.floor(
          new Date(guildData.guildCreatedDate).getTime() / 1000
        )}:R>

      **__SERVER BOOST__**
<a:Animated_boostroles:1284203982755070035> **Boost Count**: ${guildData.boostCount
        }
<:3858blurplestar:1284208376900751383> **Boost Level**: ${guildData.guildBoostLevel
        }
<:74216bughunter:1284209943842652285> **Boost Tier**: ${guildData.boostTier}
<:76061serverbooster:1284209863592906863> **Boosting Members Count**: ${guildData.boostingMembersCount
        }
      **__SERVER CHANNELS__**
<a:51047animatedarrowwhite:1284206565334843427> **Total Text Channels**: ${guildData.totalTextChannels
        }
<:79276unmuted:1284207934737223730> **Total Voice Channels**: ${guildData.totalVoiceChannels
        }
      <:67891chaticon:1284208185317527684> **Welcome Channel**: ${guildData.systemChannelName || "None"
        }
<:17927warning:1284208753339793408> **AFK Channel**: ${guildData.afkChannelName || "None"
        }

<:73430members:1284210367643259013> **Total Members**: ${guildData.memberCount}
<:73260orangetrial:1284209380304355358> **Highest Role**: ${guildData.highestRole
        }
**Online Members**: ${guildData.onlineMemberCount}
<:blurple_shield:1284206941945725098> **Verification Level**: ${guildData.verificationLevel
        }
<:48746discorddev:1284207046836752434> **Explicit Content Filter**: ${guildData.explicitContentFilter
        }
<:9466modmail:1284209038925500426> **Default Message Notifications**: ${guildData.defaultMessageNotifications
        }
<:92143verified:1284208031214735415> **MFA Level**: ${guildData.mfaLevel}
<a:32877animatedarrowbluelite:1284206601389215887> **Region**: ${guildData.region
        }
<a:32877animatedarrowbluelite:1284206601389215887> **Locale**: ${guildData.locale
        }
      `;
      console.log(`Guild region: ${guildData.region}`);
      // Create an embed with the guild data
      const infoEmbed = new EmbedBuilder()
        .setTitle(`Guild Information: ${guildData.guildName}`)
        .setColor("Blue")
        .setDescription(description);

      // Add optional fields if they exist
      if (guildData.bannerURL) infoEmbed.setImage(guildData.bannerURL);
      if (guildData.iconURL) infoEmbed.setThumbnail(guildData.iconURL);
      if (guildData.description)
        infoEmbed.setDescription(guildData.description);

      // Send the embed message with guild information
      return message.reply({ embeds: [infoEmbed] });
    } catch (error) {
      console.error(error);
      const errorEmbed = new EmbedBuilder().setDescription(
        "An error occurred while fetching guild information."
      );
      return message.reply({ embeds: [errorEmbed] });
    }
  },
};
