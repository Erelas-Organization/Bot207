import { EmbedBuilder } from "discord.js";
import { Command } from "../types";
import axios from "axios";
const command : Command = {
    name: "quote",
    execute: async (message) => {
      try {
            const response = await axios.get("https://api.popcat.xyz/quote");
            const quoteText = response.data.quote;
            const embed: EmbedBuilder = new EmbedBuilder()
                .setTitle("Quote")
                .setDescription(`${quoteText}`)     
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