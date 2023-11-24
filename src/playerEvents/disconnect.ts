import {  EmbedBuilder, Message} from "discord.js";
import { MusicPlayerEvent } from "../types";
import { GuildQueue} from "discord-player";

const event: MusicPlayerEvent = {
    name: "disconnect",
    execute: async (queue: GuildQueue<Message>) => {
        const message = queue.metadata.channel.messages.cache.get(queue.metadata.id);
        console.log("Disconnect event fired in " + queue.guild.name)
        if(!message) {
            return console.log("Couldnt find the message to edit");
        }
        const embed = new EmbedBuilder()
        .setTitle("Playback over")
        .setDescription("use `/play` to start a new playback")
        .addFields({name: "\u200B", value: "stfu Alex btw"})
        message.edit({ embeds: [embed] });
        message.reactions.removeAll();
        
    }
}

export default event;