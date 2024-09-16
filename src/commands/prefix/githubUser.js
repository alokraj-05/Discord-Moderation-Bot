const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { getPrefix } = require('../../prefix/getPrefix'); // Fetch the custom prefix for the server

module.exports = {
  name: 'gitu',
  description: 'Fetches user details from GitHub.',
  async execute(message, args) {
    // Fetch the custom prefix for the server
    const prefix = await getPrefix(message.guild.id);

    if (args.length === 0) {
      return message.channel.send(`Please provide a GitHub username. Usage: \`${prefix}githubuser <GitHub Username>\``);
    }

    const githubUsername = args[0];

    try {
      // Fetch user data from GitHub API
      const userResponse = await axios.get(`https://api.github.com/users/${githubUsername}`);
      const userData = userResponse.data;

      // Fetch repositories of the user
      const reposResponse = await axios.get(userData.repos_url);
      const reposData = reposResponse.data;

      // Calculate total commits, highest PR, and top repo
      let totalCommits = 0;
      let topRepoStars = 0;
      let topRepoName = '';
      const highestPRs = {};

      for (const repo of reposData) {
        const commitsResponse = await axios.get(repo.commits_url.replace('{/sha}', ''));
        totalCommits += commitsResponse.data.length;

        if (repo.stargazers_count > topRepoStars) {
          topRepoStars = repo.stargazers_count;
          topRepoName = repo.name;
        }

        const prResponse = await axios.get(repo.pulls_url.replace('{/number}', ''));
        highestPRs[repo.name] = prResponse.data.length;
      }

      const highestPRRepo = Object.keys(highestPRs).reduce((a, b) => (highestPRs[a] > highestPRs[b] ? a : b));

      // Fetch total contributions and followers/following count
      const contributionsResponse = await axios.get(`https://api.github.com/search/issues?q=author:${githubUsername}+type:pr`);
      const totalContributions = contributionsResponse.data.total_count;

      // Additional user details
      const followers = userData.followers;
      const following = userData.following;
      const publicGists = userData.public_gists;

      // Create embed
      const embed = new EmbedBuilder()
        .setColor('Blurple')
        .setTitle(`<:3433mipinch:1284932155574714388> ${userData.login}'s GitHub Profile`)
        .setURL(userData.html_url)
        .setThumbnail(userData.avatar_url)
        .addFields(
          { name: 'Name', value: userData.name || 'N/A', inline: true },
          { name: 'Username', value: userData.login, inline: true },
          { name: 'Total Commits', value: totalCommits.toString(), inline: true },
          { name: 'Top Repository (Stars)', value: `${topRepoName} (${topRepoStars} <:3858blurplestar:1284208376900751383>)`, inline: true },
          { name: 'Total Repositories', value: reposData.length.toString(), inline: true },
          { name: 'Highest PR Repo', value: highestPRRepo || 'N/A', inline: true },
          { name: 'Total Contributions', value: totalContributions.toString(), inline: true },
          { name: 'GitHub Joined', value: new Date(userData.created_at).toDateString(), inline: true },
          { name: 'Followers', value: followers.toString(), inline: true },
          { name: 'Following', value: following.toString(), inline: true },
          { name: 'Public Gists', value: publicGists.toString(), inline: true }
        )
        .setFooter({ text: `Requested by: ${message.author.username}` });

      return message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
      return message.channel.send('Could not fetch GitHub data. Please try again later.');
    }
  },
};
