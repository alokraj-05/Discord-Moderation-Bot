// require("dotenv").config();
// const { EmbedBuilder } = require("discord.js");
// const NewsAPI = require("newsapi");
// const newsapi = new NewsAPI(process.env.NEWSAPIKEY);

// function initializeNewsCheck(client) {
//   newsFtech(client);
//   setInterval(() => newsFtech(client), 60_000);
// }

// function newsFtech(client) {
//   newsapi.v2
//     .topHeadlines({
//       sources: "bbc-news",
//       caterogy: "politics",
//       language: "en",
//     })
//     .then((response) => {
//       if (response && response.articles) {
//         const data = response.articles.forEach((article) => {
//           const title = article.title;
//           const description = article.description;
//           const url = article.url;
//           const thumbnail = article.urlToImage;
//           const publishTime = article.publishedAt;
//           const sourceName = article.source.name;
//         });
//         console.log(data.title);
//       }
//     });
// }

// module.exports = initializeNewsCheck;
