const fs = require("fs");
const path = require("path");
module.exports = (client) => {
  const eventsPath = path.join(__dirname, "../events");
  if (!fs.existsSync(eventsPath)) {
    console.error("No events direcotry found");
    return;
  }

  const eventFolders = fs
    .readdirSync(eventsPath)
    .filter((folder) =>
      fs.statSync(path.join(eventsPath, folder)).isDirectory()
    );
  for (const folder of eventFolders) {
    const eventfiles = fs
      .readdirSync(path.join(__dirname, `../events/${folder}`))
      .filter((file) => file.endsWith(".js"));

    for (const file of eventfiles) {
      const event = require(`../events/${folder}/${file}`);

      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }
    }
  }
};
