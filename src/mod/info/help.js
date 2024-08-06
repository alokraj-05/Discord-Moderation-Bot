module.exports = {
  name: "help",
  description: "List all available commands",
  execute(message) {
    const commandList = Array.from(message.client.commands.values())
      .map((command) => command.name)
      .join("\n");
    message.channel.send(`Available commands:\n${commandList}`);
  },
};
