const commands = [
  { name: "`/lock`", description: "Locks the channel and makes it private" },
  { name: "`/help`", description: "Displays a list of all available commands" },
  { name: "`/ban`", description: "Bans the user from the server" },
  { name: "`/kick`", description: "Kick the user from the server" },
  { name: "`/timeout`", description: "set timeout for the user for 10min" },
  { name: "`/report`", description: "report the message" },
  { name: "`/spam`", description: "Send spam alert to mod" },
  {
    name: "`/yt-notifications`",
    description: "Setup youtube notifications for a channel",
  },
  {
    name: "`/unlock`",
    description: "unlocks the channel",
  },
  {
    name: "`/server`",
    description: "Get details about the server",
  },
  {
    name: "`/user`",
    description: "Get information about user",
  },
  {
    name: "`/setwelcomechannel`",
    description: "configure a channel to get join logs",
  },
];

module.exports = commands;
