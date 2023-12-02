import { SlashCommandBuilder, EmbedBuilder} from "discord.js";
import { SlashCommand } from "../types";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
      .setName("sadcat")
      .addStringOption(option => {
        return option
          .setName("text")
          .setDescription("Enter a text")
          .setRequired(true);
      })
      .setDescription("Create a sad cat meme picture."),
      
      execute: async (interaction) => {
        try {
            await interaction.deferReply();
            const text = interaction.options.getString("text");
            if(text) {
            const sadCatImageUrl = `https://api.popcat.xyz/sadcat?text=${encodeURIComponent(text)}`;
            const embed = new EmbedBuilder()
                .setImage(sadCatImageUrl);
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