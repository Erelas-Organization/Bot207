import { EmbedBuilder } from "discord.js";
import { Command } from "../../types";
import axios from "axios";
const command : Command = {
    name: "cat",
    execute: async (message) => {
      try {
            const response = await axios.get("https://cataas.com/cat?json=true");
            const imageUrl = `https://cataas.com/cat/${response.data._id}`;
              const embed = new EmbedBuilder()
              .setDescription(`EL GATOOO`)
               embed.setImage(`${imageUrl}?width=400&height=300`);
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