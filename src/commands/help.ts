import { Message, EmbedBuilder,  PermissionFlagsBits } from 'discord.js';
import { Command } from '../types';
import { join } from "path";
import { readdirSync } from "fs";
const helpCommand: Command = {
  name: 'help',
  execute: (message: Message, args: string[]) => {
    let commandsDir = join(__dirname, "../commands"); 
    const commands: Command[] = [];

    readdirSync(commandsDir).forEach(file => {
      if (file.endsWith('.ts') || file.endsWith('.js')) {
        let command : Command = require(`${commandsDir}/${file}`).default
        commands.push(command);
      }
    });

    const embed = new EmbedBuilder();
    embed.setTitle('Bot Commands')
      .setColor('#0099ff');

    const commandNames = commands.map((command) => `\`${command.name}\``).join(', ');
    embed.setDescription(`List of available commands:\n\n${commandNames}\n`);
    message.channel.send({ embeds: [embed] });
  },
  cooldown: 0,
  aliases: [],
  permissions: [], 
};

export default helpCommand;
