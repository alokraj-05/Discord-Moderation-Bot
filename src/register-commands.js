require("dotenv").config();
const { Client, GatewayIntentBits, REST, Routes } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const commands = [
  { name: "help", description: "Provides all the available commands" },
  { name: "aboutsergio", description: "Know about Sergio" },
  {
    name: "lock",
    description: "Locks the channel and makes it private",
  },
  {
    name: "unlock",
    description: "Unlocks the channel and makes it public",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("REGISTERING SLASH COMMANDS...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log("REGISTERED SLASH COMMANDS");
  } catch (error) {
    console.log(`An error occurred ${error}`);
  }
})();

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});
