import { EmbedBuilder } from "discord.js";
import { Command } from "../../types";
import axios from "axios";
const command : Command = {
    name: "tentacle",
    execute: async (message) => {
      try {
            const response = await axios.get("https://nekobot.xyz/api/image?type=tentacle");
            const imageUrl = response.data.message;
            const embed = new EmbedBuilder()
                .setDescription(`OCTOPUSSY`)
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