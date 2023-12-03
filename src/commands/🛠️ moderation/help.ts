import { Message, EmbedBuilder } from 'discord.js';
import { Command, SlashCommand } from '../../types';
import { join } from "node:path";
import { promises as fsPromises } from "node:fs";

const helpCommand: Command = {
  name: 'help',
  execute: async (message: Message) => {
    const commandsBaseDirectory = join(__dirname, "../../commands");
    const SlashCommandsBaseDirectory = join(__dirname, "../../slashCommands");
    const commandSubfolders = await fsPromises.readdir(commandsBaseDirectory);
    const slashCommandSubfolders = await fsPromises.readdir(SlashCommandsBaseDirectory);
    const categorizedCommands: { [category: string]: string[] } = {};
    const categorizedSlashCommands: { [category: string]: string[] } = {};

    for (const folder of commandSubfolders) {
      const folderPath = join(commandsBaseDirectory, folder);
      const files = await fsPromises.readdir(folderPath);
      categorizedCommands[folder] = [];

      for (const file of files) {
        if (file.endsWith('.ts') || file.endsWith('.js')) {
          const filePath = join(folderPath, file);
          const fileImport = await import(filePath);
          const command: Command = fileImport.default;
          categorizedCommands[folder].push(command.name);
        }
      }
    }

    for (const folder of slashCommandSubfolders) {
      const folderPath = join(SlashCommandsBaseDirectory, folder);
      const files = await fsPromises.readdir(folderPath);
      categorizedSlashCommands[folder] = [];

      for (const file of files) {
        if (file.endsWith('.ts') || file.endsWith('.js')) {
          const filePath = join(folderPath, file);
          const fileImport = await import(filePath);
          const command: SlashCommand = fileImport.default;
          categorizedSlashCommands[folder].push(command.command.name);
        }
      }
    }

    const embed = new EmbedBuilder();
    embed.setTitle('Bot Commands')
         .setColor('#0099ff');

         embed.addFields({ name: '__**Prefix Commands**__', value: '\u200B' }); // \u200B is a zero-width space
         for (const [category, commands] of Object.entries(categorizedCommands)) {
           if (commands.length > 0) {
             embed.addFields({ name: `${category}`, value: commands.map(cmd => `\`${cmd}\``).join(', '), inline: false });
           }
         }

         embed.addFields({ name: '\u200B', value: '------------------------------------------------------------' }); // \u200B is a zero-width space

         // Add slash commands to embed
         embed.addFields({ name: '**__Slash Commands__**', value: '\u200B' });
         for (const [category, commands] of Object.entries(categorizedSlashCommands)) {
           if (commands.length > 0) {
             embed.addFields({ name: `${category}`, value: commands.map(cmd => `\`${cmd}\``).join(', '), inline: false });
           }
         }
     
         await message.channel.send({ embeds: [embed] });
  },
  cooldown: 0,
  aliases: [],
  permissions: [], 
};

export default helpCommand;
