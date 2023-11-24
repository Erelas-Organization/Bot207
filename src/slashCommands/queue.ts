import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../types";
import { useQueue } from "discord-player";

const ITEMS_PER_PAGE = 10; // Number of tracks to display per page

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("queue")
        .addIntegerOption(option =>
            option.setName("page")
                .setDescription("Page number of the queue")
                .setRequired(false))
        .setDescription("Shows the current queue of the music player")
    ,
    execute: async interaction => {
        if (!interaction.guildId) return interaction.reply({ content: "This command can only be used in a server", ephemeral: true });
        const queue = useQueue(interaction.guildId);
        if (!queue) return interaction.reply({ content: "There is no queue for this server", ephemeral: true });

        const page = interaction.options.getInteger("page") || 1;
        const tracks = queue.tracks.toArray();
        const totalPages = Math.ceil(tracks.length / ITEMS_PER_PAGE);
        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const pageTracks = tracks.slice(start, end);

        const currentTrack = queue.currentTrack;
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Music Queue | " + interaction.guild?.name)
                    .setDescription(`Now Playing: ${currentTrack?.title}\n\n${pageTracks.map((track, index) => `**${start + index + 1}.** ${track.title} - ${track.author}`).join("\n")}\n\nPage ${page} of ${totalPages}`)
            ]
        }).then(reply => {
            setTimeout(() => reply.delete(), 15_000)
          });
    },
    cooldown: 10
};

export default command;
