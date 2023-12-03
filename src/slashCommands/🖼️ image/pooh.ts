import { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder} from "discord.js";
import { SlashCommand } from "../../types";
import axios from "axios";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
      .setName("pooh")
      .addStringOption(option => {
        return option
          .setName("text1")
          .setDescription("Enter a text")
          .setRequired(true);
      })
      .addStringOption(option => {
        return option
          .setName("text2")
          .setDescription("Enter a text")
          .setRequired(true);
      })
      .setDescription("Create a pooh meme picture."),
      
      execute: async (interaction) => {
        try {
            await interaction.deferReply();
            const text1 = interaction.options.getString("text1");
            const text2 = interaction.options.getString("text2");

            if(text1 && text2) {
            const poohImageUrl = `https://api.popcat.xyz/pooh?text1=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}`;
            const response = await axios.get(poohImageUrl, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data, 'binary');
            const attachment = new AttachmentBuilder(buffer, { name: 'pooh.png' });
            const embed = new EmbedBuilder()
                .setImage('attachment://pooh.png');
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