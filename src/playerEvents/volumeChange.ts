import { Message } from "discord.js";
import { MusicPlayerEvent } from "../types";
import { GuildQueue} from "discord-player";

const event: MusicPlayerEvent = {
    name: "volumeChange",
    execute: async (queue: GuildQueue<Message>, oldVolume: number, newVolume: number) => {
        const message = queue.metadata.channel.messages.cache.get(queue.metadata.id);
        console.log("volumeChange event fired for: "+ "in " + queue.guild.name + " from " + oldVolume + " to " + newVolume)
        if(!message) {
            return console.log("Couldnt find the message to edit");
        }
        if(message.embeds.length > 0) {
            const newEmbed = message.embeds[0];
            newEmbed.fields.find(field => field.name === "Volume")!.value = "🔊 " + "🔲".repeat(newVolume / 10) + "🔳".repeat((100-newVolume) / 10);

            message.edit({ embeds: [newEmbed] });
        }
    }
}

export default event;