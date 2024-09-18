const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("about")
    .setDescription("About Sergio"),
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: "Exodus",
        iconURL:
          "https://cdn.discordapp.com/attachments/1250377756370534432/1269354972991197306/ExodusLogo.png?ex=66afc271&is=66ae70f1&hm=1632c1ffb0d28c89787b7915123145aadfc2d5057697fb78180f3fbefaa8bf1d&",
        url: "https://discord.com/users/1161611783891587122",
      })
      .setTitle("Sergio")
      .setColor("Blue")
      .setDescription(
        "SERGIO is here to make server management effortless and efficient, allowing you to focus on what truly matters – building a thriving community. Get ready to experience the next level of Discord moderation with SERGIO!"
      )
      .addFields([
        { name: "Key Features", value: "Key features Includes:" },
        { name: "\u2008", value: "\u2008" },
        {
          name: "Automated Moderation",
          value:
            "Instantly Hnadle spam, iappropriate content, and disruptive behaviour.",
          inline: true,
        },
        {
          name: "Customizable Commnads",
          value:
            "Tailor Sergio's functionality to fit your server's unique needs.",
          inline: true,
        },
      ])
      .addFields([
        {
          name: "Role Management",
          value:
            "Easily assign and manage roles to keep your community organized.",
          inline: true,
        },
        {
          name: "Audit Logging",
          value: "Keep track of all moderation actions with detailed logs.",
          inline: true,
        },
        {
          name: "User-Friendly Interface",
          value: "Simple and intuitive controls for both admins and users.",
          inline: true,
        },
      ])
      .setImage(
        "https://cdn.discordapp.com/attachments/1250377756370534432/1269558043322880040/Black_Simple_Geometric_Discord_Profile_Banner.png?ex=66b66e50&is=66b51cd0&hm=95721a744a3de680151d1b9277554184779efd4b8d77fb5dd57c9e48b0f04e8a&"
      )
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/1250377756370534432/1269354972668104747/sergioLogo.jpeg?ex=66b659f0&is=66b50870&hm=6a4acb544ce0962244f8ad22e5d88673688d3576c5693d7998925fc5b735e387&"
      )
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: `${interaction.user.displayAvatarURL({
          dynamic: true,
        })}`,
      });
    await interaction.reply({ embeds: [embed] });
  },
};
