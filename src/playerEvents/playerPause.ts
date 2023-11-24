import { ChatInputCommandInteraction, EmbedBuilder} from "discord.js";
import { MusicPlayerEvent } from "../types";
import { GuildQueue} from "discord-player";

const event: MusicPlayerEvent = {
    name: "playerPause",
    execute: async (queue: GuildQueue<ChatInputCommandInteraction>) => {
        const metadata = queue.metadata;
        const message = await metadata.fetchReply()
        console.log("PlayerPause event fired for: "+ "in " + queue.guild.name)
        if(!message) {
            return console.log("Couldnt find the message to edit");
        }
        if(message.embeds.length > 0) {
            const oldEmbed = message.embeds[0];
            const newEmbed = new EmbedBuilder(oldEmbed.toJSON());
            newEmbed.setColor("Red");
            message.edit({ embeds: [newEmbed] });
        }
    }
}

export default event;