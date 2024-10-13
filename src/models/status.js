const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  status: { type: String, required: true },
  activityType: { type: Number, default: 2 },
  mode: { type: String, default: "dnd" },
});

module.exports = mongoose.model("Status", statusSchema);
