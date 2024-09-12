const Prefix = require("../models/prefix");

async function getPrefix(guildId) {
  const prefixData = await Prefix.findOne({ guildId: guildId });
  return prefixData ? prefixData.prefix : "S!";
}

module.exports = { getPrefix };
