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
} = require("discord.js");
const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});
const allCommands = require("./commands/commands");
client.commands = new Map();

const commandsPerPage = 5;

const functionFolder = fs.readdirSync(`./src/functions`);
for (const folder of functionFolder) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`), client;
}

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content === "hello") {
    message.reply(`Hi I am here to assist you`);
  }
});
function generateEmbed(page) {
  const start = page * commandsPerPage;
  const currentCommands = allCommands.slice(start, start + commandsPerPage);

  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle("Help")
    .setDescription("List of all available commands")
    .setTimestamp()
    .setFooter({
      text: `Page ${page + 1} of ${Math.ceil(
        allCommands.length / commandsPerPage
      )}`,
    });

  currentCommands.forEach((command) => {
    embed.addFields({
      name: command.name,
      value: command.description,
      inline: true,
    });
  });

  return embed;
}

// Help command

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand() && !interaction.isButton()) return;

  if (interaction.isCommand() && interaction.commandName === "help") {
    const embed = generateEmbed(0);
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("prev")
        .setLabel("⬅️")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId("next")
        .setLabel("➡️")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(allCommands.length <= commandsPerPage)
    );
    await interaction.reply({ embeds: [embed], components: [row] });
  } else if (interaction.isButton()) {
    const page =
      parseInt(
        interaction.message.embeds[0].footer.text.match(/Page (\d+) of/)[1],
        10
      ) - 1;

    let newPage;
    if (interaction.customId === "next") {
      newPage = page + 1;
    } else if (interaction.customId === "prev") {
      newPage = page - 1;
    }

    const embed = generateEmbed(newPage);
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("prev")
        .setLabel("⬅️")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(newPage === 0),
      new ButtonBuilder()
        .setCustomId("next")
        .setLabel("➡️")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(
          newPage === Math.ceil(allCommands.length / commandsPerPage) - 1
        )
    );

    await interaction.update({ embeds: [embed], components: [row] });
  }
});

// Other commands

client.on("interactionCreate", (interaction) => {
  if (interaction.commandName === "aboutsergio") {
    const embed = new EmbedBuilder()
      .setTitle("Sergio")
      .setColor("Blue")
      .setDescription(
        "SERGIO is here to make server management effortless and efficient, allowing you to focus on what truly matters – building a thriving community. Get ready to experience the next level of Discord moderation with SERGIO!"
      )
      .setAuthor({
        name: "Exodus",
        iconURL:
          "https://cdn.discordapp.com/attachments/1250377756370534432/1269354972991197306/ExodusLogo.png?ex=66afc271&is=66ae70f1&hm=1632c1ffb0d28c89787b7915123145aadfc2d5057697fb78180f3fbefaa8bf1d&",
        url: "https://discord.com/users/1161611783891587122",
      })
      .addFields(
        { name: "Key Features", value: "Key features include:" },
        { name: "\u200B", value: "\u200B" },
        {
          name: "Automated Moderation",
          value:
            "Instantly handle spam, inappropriate content, and disruptive behavior.",
          inline: true,
        },
        {
          name: "Customizable Commands",
          value:
            "Tailor SERGIO’s functionality to fit your server’s unique needs.",
          inline: true,
        }
      )
      .addFields(
        {
          name: "Role Management",
          value:
            "Easily assign and manage roles to keep your community organized.",
          inline: true,
        },
        {
          name: "Audit Logging",
          value: "Keep track of all moderation actions with detailed logs.",
          inline: true,
        },
        {
          name: "User-Friendly Interface",
          value: "Simple and intuitive controls for both admins and users.",
          inline: true,
        }
      )
      .setImage(
        "https://cdn.discordapp.com/attachments/1250377756370534432/1269558043322880040/Black_Simple_Geometric_Discord_Profile_Banner.png?ex=66b07f90&is=66af2e10&hm=faf176d238a3e9a58513e9551c5482a92a04dec4e252096432b5184647c53772&"
      )
      .setTimestamp()
      .setFooter({ text: "Requested at" })
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/1250377756370534432/1269354972668104747/sergioLogo.jpeg?ex=66afc270&is=66ae70f0&hm=dd8dc2e0530ad18109b79e5a73b2005b44a0b411dc772385a5dca34561e42d00&"
      );
    interaction.reply({ embeds: [embed] });
  }
});
client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content === "aboutSergio" || message.content === "sergio") {
    const embed = new EmbedBuilder()
      .setTitle("Sergio")
      .setColor("Blue")
      .setDescription(
        "SERGIO is here to make server management effortless and efficient, allowing you to focus on what truly matters – building a thriving community. Get ready to experience the next level of Discord moderation with SERGIO!"
      )
      .setAuthor({
        name: "Exodus",
        iconURL:
          "https://cdn.discordapp.com/attachments/1250377756370534432/1269354972991197306/ExodusLogo.png?ex=66afc271&is=66ae70f1&hm=1632c1ffb0d28c89787b7915123145aadfc2d5057697fb78180f3fbefaa8bf1d&",
        url: "https://discord.com/users/1161611783891587122",
      })
      .addFields(
        { name: "Key Features", value: "Key features include:" },
        { name: "\u200B", value: "\u200B" },
        {
          name: "Automated Moderation",
          value:
            "Instantly handle spam, inappropriate content, and disruptive behavior.",
          inline: true,
        },
        {
          name: "Customizable Commands",
          value:
            "Tailor SERGIO’s functionality to fit your server’s unique needs.",
          inline: true,
        }
      )
      .addFields(
        {
          name: "Role Management",
          value:
            "Easily assign and manage roles to keep your community organized.",
          inline: true,
        },
        {
          name: "Audit Logging",
          value: "Keep track of all moderation actions with detailed logs.",
          inline: true,
        },
        {
          name: "User-Friendly Interface",
          value: "Simple and intuitive controls for both admins and users.",
          inline: true,
        }
      )
      .setImage(
        "https://cdn.discordapp.com/attachments/1250377756370534432/1269558043322880040/Black_Simple_Geometric_Discord_Profile_Banner.png?ex=66b07f90&is=66af2e10&hm=faf176d238a3e9a58513e9551c5482a92a04dec4e252096432b5184647c53772&"
      )
      .setTimestamp()
      .setFooter({ text: "Requested at" })
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/1250377756370534432/1269354972668104747/sergioLogo.jpeg?ex=66afc270&is=66ae70f0&hm=dd8dc2e0530ad18109b79e5a73b2005b44a0b411dc772385a5dca34561e42d00&"
      );
    message.channel.send({ embeds: [embed] });
  }
});

//lock COMMAND TO make channel private
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, channel, member, guild } = interaction;

  if (commandName === "lock") {
    if (
      !guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)
    ) {
      await interaction.reply(
        "I don't have permission to change the channel settings."
      );
      return;
    }
    if (member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      await channel.permissionOverwrites.set([
        {
          id: interaction.guild.roles.everyone, // Everyone role
          deny: [PermissionsBitField.Flags.ViewChannel], // Deny sending messages
        },
      ]);
      await interaction.reply(`Your channel ${channel.name} is now private.`);
    } else {
      await interaction.reply(
        "You don't have permission to change the channel settings."
      );
    }
  }
});

// Unlock "PUBLIC" command
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, channel, member, guild } = interaction;

  if (commandName === "unlock") {
    if (
      !guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)
    ) {
      await interaction.reply(
        "I don't have permission to change the channel settings."
      );
      return;
    }
    if (member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      await channel.permissionOverwrites.set([
        {
          id: interaction.guild.roles.everyone, // Everyone role
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
      ]);
      await interaction.reply(`Your channel *${channel.name}* is now public.`);
    } else {
      await interaction.reply(
        "You don't have permission to change the channel settings."
      );
    }
  }
});

client.on("ready", (c) => {
  console.log(`🟢 ${c.user.tag} is now ready`);
});

client.login(process.env.TOKEN);
