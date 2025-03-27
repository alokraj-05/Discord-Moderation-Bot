const axios = require("axios");
const githubNotification = require("../../models/githubNotifications");
const { EmbedBuilder } = require("discord.js");
require("dotenv").config();
console.log("check-github.js module loaded");

// Add this near the top of the file
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Make sure to set this in your environment variables

function initializeGitHubCheck(client) {
  console.log("Initializing GitHub check...");
  checkGitHub(client);
  // Increase the interval to 5 minutes (300,000 ms)
  setInterval(() => checkGitHub(client), 300_000);
}

async function checkGitHub(client) {
  console.log("Starting GitHub check...");
  try {
    const githubNotificationConfigs = await githubNotification.find();

    for (const notificationConfig of githubNotificationConfigs) {
      const {
        username,
        lastCheckedRepos,
        guildId,
        notificationChannel,
        customMessage,
      } = notificationConfig;

      const GITHUB_EVENTS_URL = `https://api.github.com/users/${username}/events/public`;

      // Fetch GitHub events
      const events = await fetchGitHubEvents(GITHUB_EVENTS_URL);

      if (!events.length) {
        console.log(`No events found for user: ${username}`);
        continue; // If no events found, move to the next user
      }

      // Get the latest event from the response
      const latestEvent = events[0];
      const lastCheckedRepo = lastCheckedRepos?.[0]; // Assuming first repo if multiple repos are not handled

      if (
        !lastCheckedRepo ||
        (latestEvent.id !== lastCheckedRepo.repoId &&
          new Date(latestEvent.created_at) > new Date(lastCheckedRepo.pubDate))
      ) {
        // Fetch the target guild and channel
        const targetGuild =
          client.guilds.cache.get(guildId) ||
          (await client.guilds.fetch(guildId));

        if (!targetGuild) {
          await githubNotification.findByIdAndDelete(notificationConfig._id);
          continue;
        }

        const targetChannel =
          targetGuild.channels.cache.get(notificationChannel) ||
          (await targetGuild.channels.fetch(notificationChannel));

        if (!targetChannel) {
          await githubNotification.findByIdAndDelete(notificationConfig._id);
          continue;
        }

        notificationConfig.lastCheckedRepos = [
          {
            repoId: latestEvent.id,
            pubDate: latestEvent.created_at,
          },
        ];

        notificationConfig
          .save()
          .then(() => {
            const repoFullName = latestEvent.repo.name;
            const repoName = repoFullName.split("/")[1]; // Extract only the repo name
            const eventUrl = `https://github.com/${repoFullName}`; // Construct the correct GitHub URL

            const embed = new EmbedBuilder()
              .setColor("#0366d6") // GitHub blue color
              .setTitle(`New GitHub Activity: ${latestEvent.type}`)
              .setURL(eventUrl)
              .addFields(
                { name: "Repository", value: repoName, inline: true },
                { name: "User", value: latestEvent.actor.login, inline: true },
                { name: "Event Type", value: latestEvent.type, inline: true }
              )
              .setTimestamp(new Date(latestEvent.created_at))
              .setFooter({ text: "GitHub Notification" });

            // Add description if available
            if (latestEvent.payload?.description) {
              embed.setDescription(latestEvent.payload.description);
            }

            // If there's a custom message, add it to the embed
            if (customMessage) {
              const formattedMessage = customMessage
                .replace("{EVENT_TYPE}", latestEvent.type)
                .replace("{REPO_NAME}", repoName)
                .replace("{EVENT_URL}", eventUrl)
                .replace("{USERNAME}", latestEvent.actor.login)
                .replace(
                  "{DESCRIPTIONS}",
                  latestEvent.payload?.description || "No description provided"
                );

              embed.addFields({
                name: "Custom Message",
                value: formattedMessage,
              });
            }

            // Try to set the image
            try {
              const imageUrl = latestEvent.actor.avatar_url;
              if (imageUrl) {
                embed.setImage(imageUrl);
                console.log(`Set image URL: ${imageUrl}`);
              } else {
                console.log("No avatar URL found for the user");
              }
            } catch (imageError) {
              console.error("Error setting image:", imageError);
            }

            console.log(
              "Sending embed:",
              JSON.stringify(embed.toJSON(), null, 2)
            );
            targetChannel
              .send({ embeds: [embed] })
              .then(() => console.log("Message sent successfully"))
              .catch((sendError) =>
                console.error("Error sending message:", sendError)
              );
          })
          .catch((e) => console.error("Error saving notification config:", e));
      } else {
        console.log(`No new events for user: ${username}`);
      }
    }
  } catch (error) {
    console.error(`Error in checkGitHub:`, error);
  }
  console.log("GitHub check completed.");
}

async function fetchGitHubEvents(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "GitHub-Notifications-Bot",
        Authorization: `token ${GITHUB_TOKEN}`, // Add this line for authentication
      },
    });
    console.log(
      `Remaining rate limit: ${response.headers["x-ratelimit-remaining"]}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching GitHub events:", error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(
        `Rate limit remaining: ${error.response.headers["x-ratelimit-remaining"]}`
      );
    }
    return [];
  }
}

module.exports = initializeGitHubCheck;

// For testing purposes, you can uncomment the following lines:
// const mockClient = { guilds: { cache: new Map(), fetch: async () => ({}) } };
// initializeGitHubCheck(mockClient);
