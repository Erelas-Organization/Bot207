import {PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { Command } from "../types";
import axios from "axios";
const command : Command = {
    name: "cringe",
    execute: async (message, args) => {
        try {
            const response = await axios.get('https://api.waifu.pics/sfw/cringe');
            const imageUrl = response.data.url;
            let author = message.author;
            let mentionedUser = message.mentions.members?.first()
            const embed = new EmbedBuilder()
                .setImage(`${imageUrl}?width=400&height=300`)
                .setTitle("UWU")
                //.setTitle("<@" + author?.id + ">" + "cringes at" + "<@" + mentionedUser?.user.id + ">")
               // .setDescription("<@" + author?.id + ">" + "cringes at" + "<@" + mentionedUser?.user.id + ">")
              message.channel.send({ embeds: [embed] });
          } catch (error) {
            message.channel.send('An error occurred while fetching the cringe image.');
          }
    },
    cooldown: 0,
    aliases: [],
    permissions: ["Administrator", PermissionFlagsBits.ManageEmojisAndStickers]
}
export default command 
