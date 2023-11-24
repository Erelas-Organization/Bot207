import { ChatInputCommandInteraction, EmbedBuilder} from "discord.js";
import { MusicPlayerEvent } from "../types";
import { GuildQueue, Track} from "discord-player";

const event: MusicPlayerEvent = {
    name: "playerStart",
    execute: async (queue: GuildQueue<ChatInputCommandInteraction>, track: Track) => {
        const metadata = queue.metadata;
        const message = await metadata.fetchReply()
        console.log("PlayerStart event fired for: " + track.title + " in " + queue.guild.name)
        if(!message) {
            return console.log("Couldnt find the message to edit");
        }
        const embed = new EmbedBuilder()
        .setTitle("Now playing - " + track.title)
        .setDescription(track.author)
        .addFields({name: "\u200B", value: "`"+ track.duration +"`"})
        .setThumbnail(track.thumbnail)
        if(queue.history.nextTrack){
            embed.setFooter({ text: 'Up next: ' + queue.history.nextTrack.title, iconURL: queue.history.nextTrack.thumbnail })
          }
        if(message.embeds.length > 0) {
            message.edit({ embeds: [embed] });
        }
    }
}

export default event;