import { EmbedBuilder } from "discord.js";
import { Command } from "../types";
import axios from "axios";
const command : Command = {
    name: "joke",
    execute: async (message) => {
      try {
            const response = await axios.get("https://api.popcat.xyz/joke");
            const jokeText = response.data.joke;
            const embed: EmbedBuilder = new EmbedBuilder()
                .setTitle("Joke")
                .setDescription(`${jokeText}`)     
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