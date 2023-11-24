import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";
import { useQueue } from "discord-player";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("jump")
        .addIntegerOption(option =>
            option.setName("index")
                .setDescription("Index of the track to jump to")
                .setRequired(false))
        .setDescription("Jump to a specific index in the queue of the music player")
    ,
    execute: async interaction => {
        if (!interaction.guildId) return interaction.reply({ content: "This command can only be used in a server", ephemeral: true });
        const queue = useQueue(interaction.guildId);
        if (!queue || queue.isEmpty()) return interaction.reply({ content: "There is no track you can skip to", ephemeral: true });

        const index = interaction.options.getInteger("index");

        if(!index) return interaction.reply({ content: "index couldnt be read", ephemeral: true });
        if(index > queue.size || index < 0) return interaction.reply({ content: "Index doesnt exist on the queue", ephemeral: true });

        queue.node.jump(index - 1);

        return interaction.reply({ content: `Jumped to track ${index}.`, ephemeral: true })
    },
    cooldown: 10
};

export default command;
