import { EmbedBuilder, Message} from "discord.js";
import { MusicPlayerEvent } from "../types";
import { GuildQueue, Track} from "discord-player";

const event: MusicPlayerEvent = {
    name: "audioTrackAdd",
    execute: async (queue: GuildQueue<Message>, track: Track) => {
        const message = queue.metadata.channel.messages.cache.get(queue.metadata.id);
        console.log("audioTrackAdd event fired for: " + track.title + " in " + queue.guild.name)
        if(!message) {
            return console.log("Couldnt find the message to edit");
        }
        if(message.embeds.length > 0 && queue.history.nextTrack) {
            const oldEmbed = message.embeds[0];
            const newEmbed = new EmbedBuilder(oldEmbed.toJSON());
            newEmbed.setFooter({ text: 'Up next: ' + queue.history.nextTrack.title, iconURL: queue.history.nextTrack.thumbnail });
            message.edit({ embeds: [newEmbed] });
        }
    }
}

export default event;