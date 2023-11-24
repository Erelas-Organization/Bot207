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
      .addNumberOption(option => {
        return option
          .setName("duration")
          .setDescription("Duration of the poll in minutes (e.g., 0.5 for 30 seconds)")
          .setRequired(false);
      })
      .setDescription("Create a poll."),
      
      execute: async (interaction) => {
        try {
          const options: { [key: string]: string } = {};
          const voteCounts: { [key: string]: number } = {};
          const userVotes = new Map();

          if (!interaction.options) return interaction.editReply({ content: "Something went wrong..." });

          interaction.options.data.forEach(element => {
            if(element.name && element.value) {
                options[element.name] = String(element.value);
                if(element.name.startsWith("option")){
                    voteCounts[element.name] = 0;
                }
            }
        });

        let duration = interaction.options.getNumber("duration");
        if (duration === null) duration = 1;
        duration *= 60 * 1000;

        const endTime = Date.now() + duration;

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
        .setFooter({text: `No votes yet. Poll ends in ${formatTime(duration)}`});

        const reply = await interaction.reply({
            components: [row],
            embeds: [embed],
            fetchReply: true
          });

          // Countdown Timer
          const countdownInterval = setInterval(() => {
            const timeLeft = endTime - Date.now();
            updateFooter(embed, voteCounts, options, timeLeft);
            interaction.editReply({ embeds: [embed] });
        }, 5000);

        const collector = reply.createMessageComponentCollector({   
            time: duration,
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

            const timeLeft = Math.max(endTime - Date.now(), 0);
            updateFooter(embed, voteCounts, options, timeLeft);
            await buttonInteraction.update({ embeds: [embed] });
        });
          
        collector.on('end', async () => {
          clearInterval(countdownInterval);
          // Determine the highest vote count
          let maxVotes = Math.max(...Object.values(voteCounts));

          // Find all options with the highest vote count
          const winningOptions = Object.keys(voteCounts)
          .filter(optionKey => voteCounts[optionKey] === maxVotes)
          .map(optionKey => options[optionKey]);
        
          // Update the embed with the result
          let resultText;
          if (winningOptions.length === 0) {
              resultText = "No votes were cast.";
          } else if (winningOptions.length === 1) {
              resultText = `${winningOptions[0]} has the most votes with ${maxVotes} votes.`;
          } else {
              resultText = `There is a tie between: ${winningOptions.join(', ')} with ${maxVotes} votes each.`;
          }
          embed.setDescription(resultText);
          updateFooter(embed, voteCounts, options, 0, true);
          await interaction.editReply({ embeds: [embed], components: [] });
          });

      function formatTime(milliseconds:number):string {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}m ${seconds}s`;
    }

    function updateFooter(embed: EmbedBuilder, voteCounts: { [key: string]: number }, options: { [key: string]: string }, timeLeft: number, pollEnded: boolean = false) {
      let voteStatus = Object.keys(voteCounts)
          .filter(key => options[key])
          .map(key => `${options[key]}: ${voteCounts[key]}`)
          .join('\n');
      if (pollEnded) {
          embed.setFooter({ text: voteStatus });
      } else {
          let footerText = `Poll ends in: ${formatTime(timeLeft)}`;
          embed.setFooter({ text: `${voteStatus}\n${footerText}` });
      }
    }
      } catch (error) {
        console.error("Error", error);
        interaction.editReply({ content: "Something went wrong..." });
      }
    },
    cooldown: 3,
  };
  
  export default command;