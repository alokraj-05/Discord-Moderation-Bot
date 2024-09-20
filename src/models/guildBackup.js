const mongoose = require('mongoose');

const backupSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  backupKey: { type: String, required: true },
  roles: [{ name: String, id: String }],
  channels: [{ name: String, id: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Backup', backupSchema);
