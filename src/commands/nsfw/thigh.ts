import { EmbedBuilder } from "discord.js";
import { Command } from "../../types";
import axios from "axios";
const command : Command = {
    name: "thigh",
    execute: async (message) => {
      try {
            const response = await axios.get("https://nekobot.xyz/api/image?type=thigh");
            const imageUrl = response.data.message;
              const embed = new EmbedBuilder()
                .setDescription(`THIGH`)
               embed.setImage(`${imageUrl}?width=800`);
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