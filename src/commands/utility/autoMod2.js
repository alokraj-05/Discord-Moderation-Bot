const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("automod")
    .setDescription("setup auto mod for the server")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addSubcommand((cmd) =>
      cmd
        .setName("flagged-words")
        .setDescription("Block profanity, sexual content, and slurs")
    )
    .addSubcommand((cmd) =>
      cmd
        .setName("spam-messages")
        .setDescription("Block messages suspted of spam.")
    )
    .addSubcommand((cmd) =>
      cmd
        .setName("mention-spam")
        .setDescription(
          "Block messages containing a certaion amount of mentions."
        )
        .addIntegerOption((opt) =>
          opt
            .setName("value")
            .setDescription(
              "Set the number of mentions required to block a message."
            )
            .setRequired(true)
        )
    )
    .addSubcommand((cmd) =>
      cmd
        .setName("keyword")
        .setDescription("Block a given keyword in the server.")
        .addStringOption((opt) =>
          opt
            .setName("words")
            .setDescription(
              "Inappropriate words that are not supposed to be sent to the server"
            )
            .setRequired(true)
        )
    )
    .addSubcommand((cmd) =>
      cmd
        .setName("block-links")
        .setDescription("Block links in a specified channel.")
        .addChannelOption((opt) =>
          opt
            .setName("channel")
            .setDescription("Channel to block links in.")
            .setRequired(true)
        )
    )

    .addSubcommand((cmd) =>
      cmd
        .setName("rate-limit")
        .setDescription("Limit messages from users.")
        .addIntegerOption((opt) =>
          opt
            .setName("limit")
            .setDescription("Maximum messages allowed in a time period.")
            .setRequired(true)
        )
        .addIntegerOption((opt) =>
          opt
            .setName("time")
            .setDescription("Time period in seconds.")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    console.log("Slash command triggered:", interaction.commandName);
    const { guild, options } = interaction;
    const sub = options.getSubcommand();
    console.log("Subcommand triggered:", sub);

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      const errorEmbed = new EmbedBuilder()
        .setDescription(`You don't have permissions to detup automod.`)
        .setColor("Red");
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      return;
    }
    switch (sub) {
      case "flagged-words":
        console.log("Creating flagged-words automod rule...");
        await interaction.reply({
          content: `<a:Animated_Loading_3:1284206450016784394> Loading your automod rules...`,
        });

        const rule = await guild.autoModerationRules
          .create({
            name: `Block profanity, sexual content, and slurs by Sergio`,
            creatorId: "1268482584103354398",
            enabled: true,
            eventType: 1,
            triggerType: 4,
            triggerMetadata: {
              presets: [1, 2, 3],
            },
            actions: [
              {
                type: 1,
                metadata: {
                  channelId: interaction.channel,
                  durationSeconds: 10,
                  customMessage: "Message is blocked by Sergio automod",
                },
              },
            ],
          })
          .catch(async (err) => {
            console.error(err);
            setTimeout(async () => {
              await interaction.editReply({
                content: `An error occured ${err.message}`,
              });
            }, 2000);
          });
        setTimeout(async () => {
          if (!rule) return;

          const successEmbed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(
              `<:blurple_shield:1284206941945725098> Your automod rule has been created.`
            )
            .setTitle(
              "<a:1151verifiedblackanimated:1286442283289546845> Success"
            );

          await interaction.editReply({ content: "", embeds: [successEmbed] });
        }, 3000);
        break;

      case "keyword":
        await interaction.reply({
          content: `<a:Animated_Loading_3:1284206450016784394> Loading your automod rules...`,
        });

        const word = options.getString("words");
        const rule2 = await guild.autoModerationRules
          .create({
            name: `Block the word ${word} from being used by Sergio Bot.`,
            creatorId: "1268482584103354398",
            enabled: true,
            eventType: 1,
            triggerType: 1,
            triggerMetadata: {
              keywordFilter: [`${word}`],
            },
            actions: [
              {
                type: 1,
                metadata: {
                  channel: interaction.channel,
                  durationSeconds: 10,
                  customMessage: "Message is blocked by Sergio automod",
                },
              },
            ],
          })
          .catch(async (err) => {
            console.error(err);
            setTimeout(async () => {
              await interaction.editReply({
                content: `An error occured ${err.message}`,
              });
            }, 2000);
          });
        setTimeout(async () => {
          if (!rule2) return;

          const successEmbed2 = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(
              `<:blurple_shield:1284206941945725098> Your automod rule has been created - all messages containing the word ${word} will be blocked`
            )
            .setTitle(
              "<a:1151verifiedblackanimated:1286442283289546845> Success"
            );

          await interaction.editReply({ content: "", embeds: [successEmbed2] });
        }, 3000);
        break;

      case "spam-messages":
        await interaction.reply({
          content: `<a:Animated_Loading_3:1284206450016784394> Loading your automod rules...`,
        });
        const rule3 = await guild.autoModerationRules
          .create({
            name: `Block spam messages by Sergio Bot`,
            creatorId: "1268482584103354398",
            enabled: true,
            eventType: 1,
            triggerType: 3,
            triggerMetadata: {
              // mentionTotalLimit: number
            },
            actions: [
              {
                type: 1,
                metadata: {
                  channel: interaction.channel,
                  durationSeconds: 10,
                  customMessage: "Message is blocked by Sergio automod",
                },
              },
            ],
          })
          .catch(async (err) => {
            console.error(err);
            setTimeout(async () => {
              await interaction.editReply({
                content: `An error occured ${err.message}`,
              });
            }, 2000);
          });
        setTimeout(async () => {
          if (!rule3) return;

          const successEmbed3 = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(
              `<:blurple_shield:1284206941945725098> Your automod rule has been created.`
            )
            .setTitle(
              "<a:1151verifiedblackanimated:1286442283289546845> Success"
            );

          await interaction.editReply({ content: "", embeds: [successEmbed3] });
        }, 3000);
        break;

      case "mention-spam":
        await interaction.reply({
          content: `<a:Animated_Loading_3:1284206450016784394> Loading your automod rules...`,
        });
        const value = options.getInteger("value");
        const rule4 = await guild.autoModerationRules
          .create({
            name: `Prevent spam mentions by Sergio Bot`,
            creatorId: "1268482584103354398",
            enabled: true,
            eventType: 1,
            triggerType: 5,
            triggerMetadata: {
              mentionTotalLimit: value,
            },
            actions: [
              {
                type: 1,
                metadata: {
                  channel: interaction.channel,
                  durationSeconds: 10,
                  customMessage: "Message is blocked by Sergio automod",
                },
              },
            ],
          })
          .catch(async (err) => {
            console.error(err);
            setTimeout(async () => {
              await interaction.editReply({
                content: `An error occured ${err.message}`,
              });
            }, 2000);
          });
        setTimeout(async () => {
          if (!rule4) return;

          const successEmbed4 = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(
              `<:blurple_shield:1284206941945725098> Your automod rule has been created.`
            )
            .setTitle(
              "<a:1151verifiedblackanimated:1286442283289546845> Success"
            );

          await interaction.editReply({ content: "", embeds: [successEmbed4] });
        }, 3000);
        break;

      case "rate-limit":
        const limit = options.getInteger("limit");
        const time = options.getInteger("time");

        console.log("Creating rate-limit automod rule...");
        await interaction.reply({
          content: `<a:Animated_Loading_3:1284206450016784394> Loading your automod rules...`,
        });

        const rateLimitRule = await guild.autoModerationRules
          .create({
            name: `Rate limit by Sergio`,
            creatorId: "1268482584103354398",
            enabled: true,
            eventType: 1,
            triggerType: 1, // Custom trigger type for rate limits
            triggerMetadata: {
              // Trigger metadata for rate limits can be customized based on the options
              limit: limit,
              time: time,
            },
            actions: [
              {
                type: 1,
                metadata: {
                  channelId: interaction.channel.id,
                  durationSeconds: time,
                  customMessage: `You can only send ${limit} messages every ${time} seconds.`,
                },
              },
            ],
          })
          .catch(async (err) => {
            console.error(err);
            setTimeout(async () => {
              await interaction.editReply({
                content: `An error occurred: ${err.message}`,
              });
            }, 2000);
          });

        setTimeout(async () => {
          if (!rateLimitRule) return;

          const successEmbed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(
              `<:blurple_shield:1284206941945725098> Your rate limit rule has been created.`
            )
            .setTitle(
              "<a:1151verifiedblackanimated:1286442283289546845> Success"
            );

          await interaction.editReply({ content: "", embeds: [successEmbed] });
        }, 3000);
        break;

      case "block-links":
        const channel = options.getChannel("channel");

        console.log("Creating block-links automod rule for channel...");
        await interaction.reply({
          content: `<a:Animated_Loading_3:1284206450016784394> Blocking links in ${channel}...`,
        });
        const linkRegex = /(https?:\/\/[^\s]+)/g;
        const blockLinksRule = await guild.autoModerationRules
          .create({
            name: `Block links by Sergio`,
            creatorId: "1268482584103354398",
            enabled: true,
            eventType: 1, // Message send event
            triggerType: 1, // Trigger on message send
            triggerMetadata: {
              regexPatterns: [linkRegex.source],
            },
            actions: [
              {
                type: 1, // Alert action or could be delete the message
                metadata: {
                  channelId: channel.id, // Only block links in the specific channel
                  customMessage: "Links are not allowed in this channel.",
                },
              },
            ],
            // Additional metadata can be added for more customization
          })
          .catch(async (err) => {
            console.error(err);
            setTimeout(async () => {
              await interaction.editReply({
                content: `An error occurred: ${err.message}`,
              });
            }, 2000);
          });

        setTimeout(async () => {
          if (!blockLinksRule) return;

          const successEmbed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(
              `<:blurple_shield:1284206941945725098> Your block links automod rule has been created for ${channel}.`
            )
            .setTitle(
              "<a:1151verifiedblackanimated:1286442283289546845> Success"
            );

          await interaction.editReply({ content: "", embeds: [successEmbed] });
        }, 3000);
        break;
    }
  },
};
