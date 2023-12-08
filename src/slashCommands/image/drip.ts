import { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder} from "discord.js";
import { SlashCommand } from "../../types";
import axios from "axios";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
      .setName("drip")
      .addStringOption(option => {
        return option
          .setName("imageurl")
          .setDescription("Enter the image URL")
          .setRequired(false);
      })
      .addUserOption(option => {
        return option
          .setName("user")
          .setDescription("Enter the user")
          .setRequired(false);
      })
      .setDescription("Create a drip meme image"),
      
      execute: async (interaction) => {
        try {
            await interaction.deferReply();
            const user = interaction.options.getUser("user");
            const imageUrl = interaction.options.getString("imageurl");
            let finalImageUrl = imageUrl;

            if (user) {
                const avatarUrl = user.avatarURL();
                if (avatarUrl) {
                    finalImageUrl = avatarUrl.replace(/\.\w+$/, '.png');
                } else {
                    await interaction.editReply({ content: "Could not find user's avatar." });
                    return;
                }
            } else if (!imageUrl || !imageUrl.startsWith("http")) {
                await interaction.editReply({ content: "Please provide a valid image URL or a user ID." });
                return;
            }
        if (finalImageUrl) {
            const dripImageUrl = `https://api.popcat.xyz/drip?image=${encodeURIComponent(finalImageUrl)}`;
            const response = await axios.get(dripImageUrl, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data, 'binary');
            const attachment = new AttachmentBuilder(buffer, { name: 'drip.png' });
            const embed = new EmbedBuilder()
                .setTitle("DRIP DRIP MONEY DRIP")
                .setImage('attachment://drip.png');
            await interaction.editReply({ embeds: [embed], files: [attachment] });
        } else {
            await interaction.editReply({ content: "Unable to retrieve the image URL." });
        }        
        } catch (error) {
        console.error("Error", error);
        interaction.editReply({ content: "Something went wrong..." });
      }
    },
    cooldown: 0,
  };
  
  export default command;