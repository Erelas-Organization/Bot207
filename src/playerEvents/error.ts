import { ChatInputCommandInteraction} from "discord.js";
import { MusicPlayerEvent } from "../types";
import { GuildQueue, Track} from "discord-player";

const event: MusicPlayerEvent = {
    name: "error",
    execute: async (queue: GuildQueue<ChatInputCommandInteraction>, track: Track) => {
        console.log("error event fired for: " + track.title + " in " + queue.guild.name)
    }
}

export default event;