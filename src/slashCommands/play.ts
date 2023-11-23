import { SlashCommandBuilder } from "discord.js"
import { SlashCommand } from "../types";
import { useMainPlayer } from "discord-player";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("play")
    .addStringOption(option => {
      return option
        .setName("query")
        .setDescription("Query or URL of the requested track")
        .setRequired(true);
    })
    .setDescription("Play the requested track"),
  execute: async (interaction) => {
    const player = useMainPlayer();
    const guild = interaction.guild;
    const member = guild?.members.cache.get(interaction.user.id)
    const channel = member?.voice.channel
    if (!channel) return interaction.reply('You are not connected to a voice channel!');
    const query = interaction.options.getString('query', true);

    await interaction.deferReply();

    try {
        const { track } = await player.play(channel, query, {
            nodeOptions: {
                volume: 20,
                metadata: interaction
            }
        });

        return interaction.followUp(`**${track.title}** enqueued!`);
    } catch (e) {
        // let's return error if something failed
        return interaction.followUp(`Something went wrong: ${e}`);
    }

  },
  cooldown: 10
}

export default command