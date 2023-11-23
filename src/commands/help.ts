import { Message, EmbedBuilder } from 'discord.js';
import { Command } from '../types';
import { join } from "path";
import { promises as fsPromises } from "fs";

const helpCommand: Command = {
  name: 'help',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  execute: async (message: Message, args: string[]) => { // Marked as async
    const commandsDir = join(__dirname, "../commands"); 
    const files = await fsPromises.readdir(commandsDir);
    const commands: Command[] = [];

    await Promise.all(files.map(async file => {
      if (file.endsWith('.ts') || file.endsWith('.js')) {
        const filePath = join(commandsDir, file);
        const command: Command = (await import(filePath)).default;
        commands.push(command);
      }
    }));

    const embed = new EmbedBuilder();
    embed.setTitle('Bot Commands')
      .setColor('#0099ff');

    const commandNames = commands.map((command) => `\`${command.name}\``).join(', ');
    embed.setDescription(`List of available commands:\n\n${commandNames}\n`);
    await message.channel.send({ embeds: [embed] });
  },
  cooldown: 0,
  aliases: [],
  permissions: [], 
};

export default helpCommand;
