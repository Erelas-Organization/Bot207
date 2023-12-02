import { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder} from "discord.js";
import { SlashCommand } from "../types";
import axios from "axios";

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
            if(imageUrl || imageUrl?.startsWith("http")) {
                const nokiaImageUrl = `https://api.popcat.xyz/nokia?image=${encodeURIComponent(imageUrl)}`;
                const response = await axios.get(nokiaImageUrl, { responseType: 'arraybuffer' });
                const buffer = Buffer.from(response.data, 'binary');
                const attachment = new AttachmentBuilder(buffer, { name: 'nokia.png' });
                const embed = new EmbedBuilder()
                    .setImage('attachment://nokia.png');
                 await interaction.editReply({ embeds: [embed], files: [attachment] });
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