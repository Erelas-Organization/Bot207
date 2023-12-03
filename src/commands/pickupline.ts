import { EmbedBuilder } from "discord.js";
import { Command } from "../types";
import axios from "axios";

const command : Command = {
    name: "pickupline",
    execute: async (message) => {
      try {
            const response = await axios.get("https://api.popcat.xyz/pickuplines");
            const pickupLineText = response.data.pickupline;
            const embed: EmbedBuilder = new EmbedBuilder()
                .setTitle("Pick up Line ^_^ ")
                .setDescription(`${pickupLineText}`)     
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