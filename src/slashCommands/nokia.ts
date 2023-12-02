import { SlashCommandBuilder, EmbedBuilder} from "discord.js";
import { SlashCommand } from "../types";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
      .setName("nokia")
      .addStringOption(option => {
        return option
          .setName("imageurl")
          .setDescription("Enter an image URL")
          .setRequired(true);
      })
      .setDescription("Create a nokia meme picture."),
      
      execute: async (interaction) => {
        try {
            await interaction.deferReply();
            const imageUrl = interaction.options.getString("imageurl");
            console.log(imageUrl)
            if(imageUrl || imageUrl?.startsWith("http")) {
                const nokiaImageUrl = `https://api.popcat.xyz/nokia?image=${encodeURIComponent(imageUrl)}`;
                console.log(nokiaImageUrl)
                const embed = new EmbedBuilder()
                    .setImage(nokiaImageUrl);
                 await interaction.editReply({ embeds: [embed] });
            } else {
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