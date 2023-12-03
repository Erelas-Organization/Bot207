import { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder} from "discord.js";
import { SlashCommand } from "../../types";
import axios from "axios";

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
            const response = await axios.get(sadCatImageUrl, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data, 'binary');
            const attachment = new AttachmentBuilder(buffer, { name: 'sadcat.png' });
            const embed = new EmbedBuilder()
                .setImage('attachment://sadcat.png');
            await interaction.editReply({ embeds: [embed], files: [attachment] });
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