import { EmbedBuilder } from "discord.js";
import { Command } from "../types";
import axios from "axios";
const command : Command = {
    name: "dog",
    execute: async (message) => {
      try {
            const response = await axios.get("https://random.dog/woof.json");
            console.log(response.data);
            const imageUrl = response.data.url;
            const isVideo = imageUrl.endsWith('.mp4');
              if (isVideo) {
                message.channel.send(`[DOGGOOO](${imageUrl})`);
             } else {
              const embed = new EmbedBuilder()
              .setURL(`https://random.dog/id=${imageUrl.id}`)
              .setDescription(`DOGGOO`)
               embed.setImage(`${imageUrl}?width=400&height=300`);
               message.channel.send({ embeds: [embed] });
            }

          } catch (error) {
            message.channel.send(JSON.stringify(error));
          }
    },
    cooldown: 0,
    aliases: [],
    permissions: []
}
export default command 