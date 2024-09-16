const mongoose = require("mongoose");

const githubNotifcationsSchema = new mongoose.Schema(
  {
    guildId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    notificationChannel: {
      type: String,
      required: true,
    },
    customMessage: {
      type: String,
      required: false,
    },
    lastChecked: {
      type: Date,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    lastCheckedRepos: {
      type: [
        {
          repoId: {
            type: String,
            required: true,
          },
          repoName: {
            type: String,
            required: false,
          },
          pubDate: {
            type: Date,
            required: true,
          },
          repoUrl: {
            type: String,
            required: false,
          },
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("githubNotification", githubNotifcationsSchema);
