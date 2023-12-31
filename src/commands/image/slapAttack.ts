import { EmbedBuilder } from "discord.js";
import { Command } from "../../types";
import axios from "axios";
const command : Command = {
    name: "slapattack",
    execute: async (message) => {
      const data = {
        exclude: [""],
      }
        try {
            const response = await axios.post('https://api.waifu.pics/many/sfw/slap', data);
            const imageFiles: string[] = response.data.files;
            for(let index = 0; index < 5; ++index){        
            const embed = new EmbedBuilder()
                .setImage(`${imageFiles[index]}?width=200&height=200`)
                .setTitle("SLAP")
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