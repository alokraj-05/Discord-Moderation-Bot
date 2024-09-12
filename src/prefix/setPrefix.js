const Prefix = require("../models/prefix");

async function setPrefix(guildId, newPrefix) {
  await Prefix.findOneAndUpdate(
    { guildId: guildId },
    { prefix: newPrefix },
    { upsert: true, new: true }
  );
}
module.exports = { setPrefix };
