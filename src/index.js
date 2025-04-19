require("dotenv").config();
const {
  Client,
  IntentsBitField,
  EmbedBuilder,
  PermissionsBitField,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Collection,
  Events,
} = require("discord.js");

const fs = require("fs");
const path = require("node:path");
const mongoose = require("mongoose");
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMessageReactions,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const allCommands = require("./data/commands");
client.commands = new Collection();
client.cooldowns = new Collection();
const initializeGitHubCheck = require("./events/guild/check-github");

// After your client is ready (usually in a 'ready' event handler):
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  initializeGitHubCheck(client);
});

const commandsPerPage = 7;
require("./handlers/stealHandler")(client);
require("./handlers/announceCommandHandler")(client);
require("./handlers/purgeCommandHandler")(client);
require("./handlers/prefixCommandHandler")(client);
require("./handlers/slashCommandHandler")(client);
require("./handlers/eventHandler")(client);
const messageInteractionHandler = require("./handlers/messageInteractionHandler");
messageInteractionHandler(client);
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Other commands

client.on("guildMemberUpdate", async (oldMember, newMember) => {
  const adminLogChannel = newMember.guild.channels.cache.find(
    (c) => c.name === "admin-log"
  );
  if (!adminLogChannel) return;
  const adminLogEmbed = new EmbedBuilder()
    .setTitle("Changes")
    .setDescription(
      `<@${newMember.id}> has ${
        newMember.permissions.has(PermissionsBitField.Flags.Administrator)
          ? "gained"
          : "lost"
      } administrator privileges.`
    )
    .setColor("Yellow")
    .setTimestamp();
  if (
    oldMember.permissions.has(PermissionsBitField.Flags.Administrator) !==
    newMember.permissions.has(PermissionsBitField.Flags.Administrator)
  ) {
    await adminLogChannel.send({ embeds: [adminLogEmbed] });
  }
});

client.on("guildMemberAdd", async (member) => {
  const welcomeChannel = member.guild.channels.cache.find(
    (c) => c.name === "welcome-log"
  );
  const newMemberEmbed = new EmbedBuilder()
    .setDescription(`<@${member.id}>, just joined **${member.guild.name}**!`)
    .setColor("Blurple")
    .setTimestamp();
  if (welcomeChannel) {
    await welcomeChannel.send({ embeds: [newMemberEmbed] });
  }
});

async function alert(channel, message) {
  const alertEmbed = new EmbedBuilder()
    .setColor("Red")
    .setTimestamp()
    .setDescription(message);

  await channel.send({ embeds: [alertEmbed] });
}

client.on("guildBanAdd", async (ban, message) => {
  const executor = message.member;
  const alertChannel = ban.guild.channels.cache.find((c) => c.name === "alert");
  if (alertChannel) {
    await alert(
      alertChannel,
      `<:3514miok:1284964043786027131> User: **${ban.user.tag}** was banned by **${executor}`
    );
  }
});
client.on("channelDelete", async (channel) => {
  const alertChannel = channel.guild.channels.cache.find(
    (c) => c.name === "alert"
  );
  if (!alertChannel) return;
  await alert(
    alertChannel,
    `Channel delete activity detected **${channel.name}** ID\`${channel.id}\` was deleted. `
  );
});

client.on("roleDelete", async (role) => {
  const alertChannel = role.guild.channels.cache.find(
    (c) => c.name === "alert"
  );
  if (!alertChannel) return;

  await alert(
    alertChannel,
    `Role delete activity detected **${role.name}** ID\`${role.id}\` was deleted.`
  );
});

client.on("roleCreate", async (role) => {
  const alertChannel = role.guild.channels.cache.find(
    (c) => c.name === "alert"
  );
  if (!alertChannel) return;

  await alert(alertChannel, `Role create \`${role.name}\` ID \`${role.id}\`.`);
});

// client.on("roleUpdate", async (oldRole, newRole) => {
//   const alertChannel = newRole.guild.channels.cache.find(
//     (c) => c.name === "alert"
//   );
//   if (!alertChannel) return;
//   if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
//     await alert(
//       alertChannel,
//       `Role **${newRole.name}** (ID: ${newRole.id}) had its permissions changed.`
//     );
//   }
//   if (oldRole.name !== newRole.name) {
//     await alert(
//       alertChannel,
//       `Role name changed from **${oldRole.name}** to **${newRole.name}** (ID: ${newRole.id}).`
//     );
//   }
// });

client.on("guildMemberUpdate", async (oldMember, newMember) => {
  const alertChannel = newMember.guild.channels.cache.find(
    (c) => c.name === "alert"
  );
  if (!alertChannel) return;
  const oldRoles = oldMember.roles.cache;
  const newRoles = newMember.roles.cache;
  const addedRoles = newRoles.filter((role) => !oldRoles.has(role.id));
  const removedRoles = oldRoles.filter((role) => !newRoles.has(role.id));

  if (addedRoles.size > 0) {
    await alert(
      alertChannel,
      `Role added: ${addedRoles.map((role) => role.name).join(", ")} to **${
        newMember.displayName
      }**`
    );
  }
  if (removedRoles.size > 0) {
    await alert(
      alertChannel,
      `Role removed: ${removedRoles.map((role) => role.name).join(", ")} to **${
        newMember.displayName
      }**`
    );
  }
  if (oldMember.nickname !== newMember.nickname) {
    await alert(
      alertChannel,
      `Nickname changed from ${oldMember.nickname} to ${newMember.nickname}`
    );
  }
});

client.on("guildMemberRemove", async (member) => {
  const auditLogs = await member.guild.fetchAuditLogs({
    type: 20,
    limit: 1,
  });
  const kickLog = auditLogs.entries.first();

  const alertChannel = member.guild.channels.cache.find(
    (c) => c.name === "alert"
  );
  if (!alertChannel) return;

  if (kickLog && kickLog.target.id === member.id) {
    await alert(
      alertChannel,
      `<:3514miok:1284964043786027131> Suspicious activity detected: **${member.user.tag}** (ID: ${member.id}) was kicked by **${kickLog.executor.tag}**.`
    );
  }
});
// client.on('messageDeleteBulk', async (member)=> {

// })

// welcome message

const GuildSettings = require("../src/models/guildSettings");
const { channel } = require("diagnostics_channel");
const { permission } = require("process");

client.on("guildMemberAdd", async (member) => {
  const guildId = member.guild.id;
  try {
    const settings = await GuildSettings.findOne({ guildId });

    if (!settings || !settings.welcomeChannelId) return;

    const channel = member.guild.channels.cache.get(settings.welcomeChannelId);
    if (!channel) return;

    const rulesChannel =
      member.guild.channels.cache.find((ch) => ch.name.includes("rules")) ||
      "rules channel";
    const rolesChannel =
      member.guild.channels.cache.find((ch) =>
        ch.name.includes("self-roles")
      ) || "self roles channel";

    // Create the embed for the welcome message
    const welcomeEmbed = new EmbedBuilder()
      .setColor("#0ebcff")
      .setTitle("Welcome!")
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `Hello **__${member.user.username}__** , a.k.a **<@${member.id}>**!
      
    Welcome to **${member.guild.name}**! We're glad to have you here. 😊

    Make sure to check out ${rulesChannel} to familiarize yourself with the server rules, and visit ${rolesChannel} to assign yourself some roles.`
      )
      .setFooter({
        text: `We now have __${member.guild.memberCount}__ members!`,
      })
      .setTimestamp();

    await channel.send({ embeds: [welcomeEmbed] });
  } catch (error) {
    console.error("Error retrieving guild settings:", error);
  }
});

client.on("error", (error) => {
  console.error("Discord client error:", error);
});

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Connected to DB");

  client.on("ready", (c) => {
    console.log(`🟢 ${c.user.tag} is now ready`);
  });
  client.login(process.env.TOKEN);
});
