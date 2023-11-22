import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { getThemeColor } from "../functions";
import { SlashCommand } from "../types";
import { Message, CollectorFilter, MessageReaction, User } from "discord.js";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("reactioncounter")
    .setDescription("Displays the total number of reactions"),
  execute: async (interaction) => {
    try {
      // Fetch the message for which you want to count reactions
      const message = (await interaction.channel?.messages.fetch({ around: interaction.id, limit: 1 })) as Message | undefined;

      // Check if the message is found
      if (message) {
        // Check if the message has reactions
        if (message.reactions) {
          const embed = new EmbedBuilder()
            .setAuthor({ name: "Reaction Counter" })
            .setColor(getThemeColor("text"));

          const reactionCollectorFilter: CollectorFilter<[MessageReaction, User]> = (reaction) => !reaction.users.cache.has(interaction.client.user!.id);
          const reactionCollector = message.createReactionCollector({ filter: reactionCollectorFilter, time: 60000 });

          reactionCollector.on("collect", (reaction) => {
            const reactionCount = reactionCollector.collected.reduce((acc, collectedReaction) => acc + collectedReaction.count, 0);

            // Check if there are reactions
            if (reactionCount > 0) {
              embed.setDescription(`Number of Reactions: ${reactionCount}`);
            } else {
              embed.setDescription("Number of Reactions: 0");
            }

            interaction.editReply({ embeds: [embed] });
          });

          reactionCollector.on("end", () => {
            console.log("Reaction collection ended.");
          });

          interaction.reply({
            embeds: [
              embed.setDescription("Number of Reactions: 0"),
            ],
          });
        } else {
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setAuthor({ name: "Reaction Counter" })
                .setDescription("Number of Reactions: 0")
                .setColor(getThemeColor("text")),
            ],
          });
        }
      } else {
        interaction.reply("Unable to fetch the message.");
      }
    } catch (error) {
      console.error("Error fetching message:", error);
      interaction.reply("An error occurred while fetching the message.");
    }
  },
  cooldown: 3,
};

export default command;
