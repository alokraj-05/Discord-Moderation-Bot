const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const githubNotification = require("../../models/gtihubNotifications");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("github-notficiation")
    .setDescription(
      "Setup your GitHub account with discord to get every updates."
    )
    .addSubcommand((option) =>
      option
        .setName("add")
        .setDescription(
          "Add you github account to pull update repos to the server."
        )
        .addStringOption((option) =>
          option
            .setName("username")
            .setDescription("Enter the github account username!")
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription(
              "Select the channel in which you want to log Github notifications."
            )
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("custom-message")
            .setDescription(
              "TEMPLATE: {USERNAME} {REPO_NAME} {EVENT_TYPE}{DESCRIPTIONS} {EVENT_URL}"
            )
        )
    )
    .addSubcommand((option) =>
      option
        .setName("remove")
        .setDescription("Remove the configured account.")
        .addStringOption((option) =>
          option
            .setName("username")
            .setDescription("Enter the Username of the github account.")
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Select the configured channel")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const { options } = interaction;
    const sub = options.getSubcommand();
    const username = options.getString("username");
    const channel = options.getChannel("channel");
    const userId = interaction.user.id;
    async function sendFailMessage(message) {
      const failEmbed = new EmbedBuilder()
        .setDescription(message)
        .setColor("Red")
        .setTimestamp()
        .setFooter({
          text: `Command executed by ${interaction.user.tag}`,
          iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}`,
        });
      await interaction.reply({ embeds: [failEmbed], ephemeral: true });
    }
    async function sendSuccessMessage(message) {
      const successEmbed = new EmbedBuilder()
        .setDescription(message)
        .setColor("Blurple")
        .setTimestamp()
        .setFooter({
          text: `Command executed by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        });
      await interaction.reply({ embeds: [successEmbed] });
    }

    switch (sub) {
      case "add": {
        const customMessage = options.getString("custom-message");
        const duplicateExist = await githubNotification.exists({
          notificationChannel: channel.id,
          username: username,
        });
        if (duplicateExist) {
          await sendFailMessage(
            `<:17927warning:1284208753339793408> Github account **${username}** has already been configured for the channel **${channel}!**`
          );
          return;
        }
        const newNotification = new githubNotification({
          guildId: interaction.guild.id,
          username: username,
          notificationChannel: channel.id,
          userId: userId,
          customMessage: customMessage || null, // Optional custom message
          lastChecked: new Date(), // Setting the current time as the last check
          lastCheckedRepo: {
            id: null, // No repo has been checked yet
            pubDate: new Date(0), // A default very old date to ensure new repos get caught
          },
        });
        try {
          await newNotification.save();
          await sendSuccessMessage(
            `<a:verifiedPurpleTick:1284198366653448245> Successfully configured GitHub notifications for **${username}** in the channel **${channel}**.`
          );
        } catch (error) {
          console.error("Error saving GitHub notification:", error);
          await sendFailMessage(
            `<:17927warning:1284208753339793408> An error occurred while saving the GitHub notification for **${username}**.`
          );
        }
        break;
      }
      case "remove": {
        const existingNotification = await githubNotification.findOne({
          username: username,
          notificationChannel: channel.id,
        });

        if (!existingNotification) {
          await sendFailMessage(
            `<:17927warning:1284208753339793408> No GitHub notification found for **${username}** in the channel **${channel}**.`
          );
          return;
        }
        const existingUser = await githubNotification.findOne({ userId: userId })
        if (userId === existingUser) {
          try {
            await githubNotification.findOneAndDelete({
              username: username,
              notificationChannel: channel.id,
            });
            await sendSuccessMessage(
              `<a:verifiedPurpleTick:1284198366653448245> Successfully removed GitHub notifications for **${username}** from the channel **${channel}**.`
            );
          } catch (error) {
            console.error("Error removing GitHub notification:", error);
            await sendFailMessage(
              `<:17927warning:1284208753339793408> An error occurred while removing the GitHub notification for **${username}**.`
            );
          }
        } else {
          sendFailMessage(`You can not remove notifications for another user either conatct user or support server.`);

        }
        break;
      }
      default:
        await sendFailMessage(
          `<:17927warning:1284208753339793408> Invalid subcommand.`
        );
        break;
    }
  },
};
