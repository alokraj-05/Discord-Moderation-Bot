const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");

module.exports = (client) => {
  const interactionPath = path.join(__dirname, "../MessageInteraction");
  const files = fs
    .readdirSync(interactionPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of files) {
    const interactionFile = require(`${interactionPath}/${file}`);
    if (typeof interactionFile.execute === "function") {
      interactionFile.execute(client);
    }
  }
};
