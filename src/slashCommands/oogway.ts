import { SlashCommandBuilder, EmbedBuilder} from "discord.js";
import { SlashCommand } from "../types";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
      .setName("oogway")
      .addStringOption(option => {
        return option
          .setName("text")
          .setDescription("Enter a text")
          .setRequired(true);
      })
      .setDescription("Create an oogway meme picture."),
      
      execute: async (interaction) => {
        try {
            await interaction.deferReply();
            const text = interaction.options.getString("text");
            if(text) {
            const oogwayImageUrl = `https://api.popcat.xyz/oogway?text=${encodeURIComponent(text)}`;
            const embed = new EmbedBuilder()
                .setImage(oogwayImageUrl);
            await interaction.editReply({ embeds: [embed] });
            } else{
                await interaction.editReply({ content: "Unable to retrieve the text" });
            }
        } catch (error) {
        console.error("Error", error);
        interaction.editReply({ content: "Something went wrong..." });
      }
    },
    cooldown: 0,
  };
  export default command;