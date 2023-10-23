import { PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { Command } from "../types";
import axios from "axios";
const command: Command = {
  name: "cringe",
  execute: async (message, args) => {
    try {
      const response = await axios.get("https://api.waifu.pics/sfw/cringe");
      const imageUrl = response.data.url;
      let author = message.author;
      let mentionedUser = message.mentions.members?.first();
      let rndDescriptions:string[] = [
      `<@${author?.id}> is cringing at <@${mentionedUser?.user.id}>`, 
      `Why are u so cringe <@${mentionedUser?.user.id}> ?`, 
      `<@${author?.id}> finds <@${mentionedUser?.user.id}> incredibly cringe`,
      `Watching <@${mentionedUser?.user.id}> being cringe is my daily entertainment.`,
      `Vallah Bilah <@${mentionedUser?.user.id}> mach nicht diesen. `
    ];
      let randomDescription = rndDescriptions[Math.floor(Math.random() * rndDescriptions.length)];
      let embed: EmbedBuilder;
      if (mentionedUser) {
        embed = new EmbedBuilder()
          .setImage(`${imageUrl}?width=400&height=300`)
          .setDescription(randomDescription);
      } else {
        embed = new EmbedBuilder()
          .setImage(`${imageUrl}?width=400&height=300`)
          .setDescription(`<@${author?.id}> is cringing.`);
      }
      message.channel.send({ embeds: [embed] });
    } catch (error) {
      message.channel.send(
        "An error occurred while fetching the cringe image."
      );
    }
  },
  cooldown: 0,
  aliases: [],
  permissions: ["Administrator", PermissionFlagsBits.ManageEmojisAndStickers],
};
export default command;
