import { EmbedBuilder } from "discord.js";
import { Command } from "../../types";
import axios from "axios";
const command : Command = {
    name: "fact",
    execute: async (message) => {
      try {
            const response = await axios.get("https://api.popcat.xyz/fact");
            const factText = response.data.fact;
            const embed: EmbedBuilder = new EmbedBuilder()
                .setTitle("Fact")
                .setDescription(`${factText}`)     
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