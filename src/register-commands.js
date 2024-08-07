require("dotenv").config();
const { Client, GatewayIntentBits, REST, Routes } = require("discord.js");
const path = require("path");
const fs = require("fs");

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

const folderPath = path.join(__dirname, "commands");
const commandsFolder = fs.readdirSync(folderPath);

for (const folder of commandsFolder) {
  const commandPath = path.join(folderPath, folder);
  const commandFiles = fs
    .readdirSync(commandPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}
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
