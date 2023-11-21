import { EmbedBuilder } from "discord.js";
import { Command } from "../types";
import axios from "axios";
const command : Command = {
    name: "slap",
    execute: async (message) => {
      try {
            const response = await axios.get("https://api.waifu.pics/sfw/slap");
            const imageUrl = response.data.url;
            const author = message.author;
            const mentionedUser = message.mentions.members?.first();
            let embed: EmbedBuilder;
            if(mentionedUser){
              embed = new EmbedBuilder()
                .setImage(`${imageUrl}?width=400&height=300`)
                .setDescription(`<@${author?.id}> slaps <@${mentionedUser?.user.id}>`);
          }else{
            embed = new EmbedBuilder()
            .setImage(`${imageUrl}?width=400&height=300`)
            .setDescription("SLAP");
          }     
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