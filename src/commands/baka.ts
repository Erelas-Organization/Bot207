import {EmbedBuilder } from "discord.js";
import { Command } from "../types";
import axios from "axios";
const command : Command = {
    name: "baka",
    execute: async (message) => {
      try {
            const response = await axios.get("https://nekos.best/api/v2/baka");
            const imageUrl = response.data.results[0].url;
            const author = message.author;
            const mentionedUser = message.mentions.members?.first();
            let embed: EmbedBuilder;
            if(mentionedUser){
              embed = new EmbedBuilder()
                .setImage(`${imageUrl}?width=400&height=300`)
                .setDescription(`<@${author?.id}> says: <@${mentionedUser?.user.id}> is a baka!`);
          }else{
            embed = new EmbedBuilder()
            .setImage(`${imageUrl}?width=400&height=300`)
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