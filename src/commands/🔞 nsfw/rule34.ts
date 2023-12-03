import { EmbedBuilder, TextChannel } from "discord.js";
import { Command } from "../../types";
import axios from "axios";
const command : Command = {
    name: "rule34",
    execute: async (message, arguments_) => {
        if (!(message.channel instanceof TextChannel) || !message.channel.nsfw) {
            return message.channel.send("This command can only be used in NSFW channels.");
        }
      try {
        const filteredArguments = arguments_.filter(argument => argument.toLowerCase() !== 'rule34');
        const tags = filteredArguments.join(" ");
        if (!tags) {
            return message.channel.send("Please provide some tags.");
        }
        const encodedTags = encodeURIComponent(tags);
        const url = `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${encodedTags}&json=1`;
        const response = await axios.get(url);
        const posts = response.data;
        if (!posts || posts.length === 0) {
            return message.channel.send("No results found for the given tags.");
        }
        const post = posts[Math.floor(Math.random() * posts.length)];
        const isVideo = post.file_url.endsWith('.mp4');
        const embed = new EmbedBuilder()
        .setTitle("Gönn Dir!")
        .setURL(`https://rule34.xxx/index.php?page=post&s=view&id=${post.id}`)
        .setFooter({ text: `Tags: ${post.tags}` });
        if (isVideo) {
            message.channel.send(`[Video link:](${post.file_url})`);
        } else {
            embed.setImage(post.file_url);
        }
     message.channel.send({ embeds: [embed] });
          } catch (error) {
            console.error(error);
            message.channel.send("An error occurred while fetching data.");
          }
    },
    cooldown: 0,
    aliases: [],
    permissions: []
}
export default command 