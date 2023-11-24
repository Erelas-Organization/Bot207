import { SlashCommandBuilder } from "discord.js"
import { SlashCommand } from "../types";
import { useQueue } from "discord-player";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("volume")
    .addNumberOption(option => {
      return option
        .setName("volume")
        .setDescription("Volume of the player")
        .setRequired(true);
    })
    .setDescription("Sets the volume of the player"),
  execute: async (interaction) => {
    if (!interaction.guildId){
        return interaction.reply("This command can only be used in a server")
    }
    const queue = useQueue(interaction.guildId);

    try {
        const volume = interaction.options.getNumber('volume', true);
        queue?.node.setVolume(volume);
        return interaction.reply(`Volume set to ${volume}`);
    } catch (error) {
        // let's return error if something failed
        return interaction.reply(`Something went wrong: ${error}`);
    }

  },
  cooldown: 10
}

export default command