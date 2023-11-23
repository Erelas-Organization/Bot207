import { EmbedBuilder } from "discord.js";
import { Command } from "../types";
import axios from "axios";
const command : Command = {
    name: "thumbsup",
    execute: async (message) => {
      try {
            const response = await axios.get("https://nekos.best/api/v2/thumbsup");
            const imageUrl = response.data.results[0].url;
            const author = message.author;
            const embed: EmbedBuilder = new EmbedBuilder()
            .setImage(`${imageUrl}?width=400&height=300`)
            .setDescription(`<@${author?.id}> is happy.`);
          message.channel.send({ embeds: [embed] });
          } catch (error) {
            message.channel.send(JSON.stringify(error));
          }
    },
    cooldown: 0,
    aliases: [],
    permissions: []
}
export default command 