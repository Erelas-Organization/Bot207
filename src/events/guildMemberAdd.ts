import { GuildMember, EmbedBuilder, TextChannel, AttachmentBuilder } from "discord.js";
import { BotEvent } from "../types";
import fs from 'node:fs';

const welcomeEvent: BotEvent = {
    name: "guildMemberAdd",
    execute: (member: GuildMember) => {
        const buffer = fs.readFileSync('C://Users/tim18/Downloads/hi.png');
        const attachment = new AttachmentBuilder(buffer, { name: 'hi.png' });
        const welcomeEmbed = new EmbedBuilder()
            .setDescription(`Welcome to the server, ${member.user.username}!`)
            .setImage('attachment://hi.png')
            .setColor('Purple');
            const generalChannel = member.guild.channels.cache
            .find(channel => channel.name === 'general' && channel instanceof TextChannel);

        if (generalChannel && generalChannel instanceof TextChannel) {
            generalChannel.send({ embeds: [welcomeEmbed], files: [attachment] }).catch(console.error);
        }
        }
    };

export default welcomeEvent;