import { SlashCommandBuilder, EmbedBuilder} from "discord.js";
import { getThemeColor } from "../functions";
import { SlashCommand } from "../types";
import {CollectorFilter, MessageReaction, User } from "discord.js";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("reactioncounter")
    .setDescription("Displays the total number of reactions"),
  execute: async (interaction) => {
    try {
      let reactionCount = 0;
      const embed = new EmbedBuilder()
      .setAuthor({name: "Reaction Counter"})
      .setDescription(`Number of Reactions: ${reactionCount}`)

      const message = await interaction.reply({embeds: [embed], fetchReply:true});
      const collector = message.createReactionCollector({time: 10000});
      
      collector.on('collect', (reaction:MessageReaction, user:User) => {
        reactionCount++;
        message.edit({embeds: [embed.setDescription(`Total Reactions: ${reactionCount}`)]})
      })

      collector.on('end', collected => {
        console.log(`Collected ${collected.size} items`);     
      })
    } catch (error) {
      console.error("Error fetching message:", error);
      interaction.reply("An error occurred while fetching the message.");
    }
  },
  cooldown: 3,
};

export default command;
