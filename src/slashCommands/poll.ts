import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder} from "discord.js";
import { SlashCommand } from "../types";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
      .setName("poll")
      .addStringOption(option => {
        return option
          .setName("question")
          .setDescription("Question for the poll")
          .setRequired(true);
      })
      .addStringOption(option => {
        return option
          .setName("option1")
          .setDescription("Option 1 for the poll")
          .setRequired(true);
      })
      .addStringOption(option => {
        return option
          .setName("option2")
          .setDescription("Option 2 for the poll")
          .setRequired(true);
      })
      .addStringOption(option => {
        return option
          .setName("option3")
          .setDescription("Option 3 for the poll")
          .setRequired(false);
      })
      .addStringOption(option => {
        return option
          .setName("option4")
          .setDescription("Option 4 for the poll")
          .setRequired(false);
      })
      .setDescription("Create a poll."),
      
      execute: async (interaction) => {
        try {
          const options: { [key: string]: string} = {};
          const voteCounts: { [key: string]: number } = {};
          const userVotes = new Map();

          if (!interaction.options) return interaction.editReply({ content: "Something went wrong..." });

          for (let i = 0; i < interaction.options.data.length; i++) {
           const element = interaction.options.data[i];
            if(element.name && element.value) {
                options[element.name] = String(element.value);
                if(element.name.startsWith("option")){
                    voteCounts[element.name] = 0;
                }
            }
        }
        const buttons = [];
        for (let i = 1; i <= 4; i++) {
            const optionName = `option${i}`;
            const optionValue = options[optionName];

            if (optionValue) {
                const button = new ButtonBuilder()
                  .setCustomId(`option_${i}`)
                  .setLabel(optionValue)
                  .setStyle(ButtonStyle.Primary);
      
                buttons.push(button);
            }
        }
        const row = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(...buttons);

        const embed = new EmbedBuilder()
        .setTitle(options.question.toString())
        .setColor('Purple')
        .setFooter({text: "No votes yet"});

        const reply = await interaction.reply({
            components: [row],
            embeds: [embed],
            fetchReply: true
          });

        const collector = reply.createMessageComponentCollector({   
            time: 10000,
        })

        collector.on('collect', async(buttonInteraction) => {       
            const userId = buttonInteraction.user.id;
            const selectedOption = buttonInteraction.customId;
            const optionKey = selectedOption.replace('option_', 'option');
            
            // Remove previous vote if exists
            if (userVotes.has(userId)) {
                const previousVote = userVotes.get(userId);
                voteCounts[previousVote]--;
            }

            // Update the vote count and user vote
            voteCounts[optionKey]++;
            userVotes.set(userId, optionKey);

            // Update the embed footer
            const updatedFooterText = Object.keys(voteCounts)
            .filter(key => options[key])
            .map(key => `${options[key]}: ${voteCounts[key]}`)
            .join(', ');

        embed.setFooter({ text: updatedFooterText });

        // Update the message
        await buttonInteraction.update({ embeds: [embed] });
        });
          
        collector.on('end', collected => {
            console.log(`Poll ended. Votes: ${JSON.stringify(voteCounts)}`);     
        })
      } catch (error) {
        console.error("Error", error);
        interaction.editReply({ content: "Something went wrong..." });
      }
    },
    cooldown: 3,
  };
  
  export default command;