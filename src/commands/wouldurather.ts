import { EmbedBuilder } from "discord.js";
import { Command } from "../types";
import axios from "axios";
const command : Command = {
    name: "wouldurather",
    execute: async (message) => {
      try {
            const response = await axios.get("https://api.popcat.xyz/wyr");
            const firstOption = response.data.ops1;
            const secondOption = response.data.ops2;
            const embed: EmbedBuilder = new EmbedBuilder()
                .setTitle("Would You Rather")
                .setDescription(`**Option 1:** ${firstOption} \n\n **Option 2:** ${secondOption}`)   
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