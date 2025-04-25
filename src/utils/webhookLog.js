const axios = require("axios");
const fs = require("fs");
const path = require("path");

class WebhookLogger {
  constructor(options = {}) {
    this.webhooks = {
      guildJoin: options.guildJoin || process.env.JOIN_WEBHOOK_URL,
      guildLeave: options.guildLeave || process.env.LEAVE_WEBHOOK_URL,
    };
    this.logToConsole = true;
    this.cacheLog = true;
    this.cacheDir = path.join(__dirname, "..", "..", "logging", "log");
    if (this.cacheLog && !fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir);
    }
  }
  async sendLog(type, embedData, content = "") {
    const url = this.webhooks[type];
    const logPayLoad = {
      username: "Sergio Logger",
      content,
      embeds: [this._styleEmbed(type, embedData)],
    };

    try {
      if (!url) throw new Error(`No webhook URL defined for ${type}`);

      await axios.post(url, logPayLoad);
      if (this.logToConsole) {
        console.log(
          `[WebhookLogger] sent ${type} log:`,
          embedData.title || embedData.description
        );
      }

      if (this.cacheLog) {
        this._cacheLog(type, logPayLoad);
      }
    } catch (error) {
      console.warn(
        `[WebhookLogger] Failed to send ${type} log: ${error.message}`
      );
    }
  }
  _styleEmbed(type, embed) {
    const styling = {
      guildJoin: { color: 0x57f287, emoji: "📥" },
      guildLeave: { color: 0xed4245, emoji: "📤" },
    };
    const style = styling[type] || {};
    return {
      ...embed,
      color: embed.color || style.color,
      title: `${style.emoji || ""} ${embed.title || ""}`.trim(),
      timestamp: new Date().toISOString(),
    };
  }
  _cacheLog(type, data) {
    const file = path.join(this.cacheDir, `${type}.log`);
    const entry = `[${new Date().toISOString()}] ${
      data.content || ""
    }\n${JSON.stringify(data.embeds[0], null, 2)}\n\n`;
    fs.appendFileSync(file, entry);
  }
}

module.exports = WebhookLogger;
