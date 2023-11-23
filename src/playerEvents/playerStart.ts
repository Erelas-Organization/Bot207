import { ChatInputCommandInteraction, EmbedBuilder, MessageReaction, User} from "discord.js";
import { MusicPlayerEvent } from "../types";
import { GuildQueue, Track, useHistory } from "discord-player";

const event: MusicPlayerEvent = {
    name: "playerStart",
    execute: async (queue: GuildQueue<ChatInputCommandInteraction>, track: Track) => {
        const embed = new EmbedBuilder().setTitle("Now playing - " + track.title).setDescription(track.author).addFields({name: "\u200b", value: "`"+ track.duration +"`"}).setThumbnail(track.thumbnail)
        const metadata = queue.metadata;
        const message= await metadata.channel?.send({embeds: [embed]});
        const queueHistory = useHistory(queue);
        if(!message) {
            return console.log("Message couldnt be created after enqueue");
        }
        message.react('⏮️')
			.then(() => message.react('⏯️'))
			.then(() => message.react('⏹️'))
            .then(() => message.react('⏭️'))
            .then(() => message.react('🔀'))
            .then(() => message.react('🔁'))
            .then(() => message.react('🔂'))
			.catch(error => console.error('One of the emojis failed to react:', error));
            const collector = message.createReactionCollector({time: track.durationMS})
            collector.on('collect', (reaction: MessageReaction, user: User) => {
                if(user.bot || !queue || !queueHistory) return;
                switch(reaction.emoji.name){
                    case '⏮️':
                        if(queueHistory.previousTrack){
                        queueHistory.back();
                    }
                        break;
                    case '⏯️':
                        queue.node.setPaused(!queue.node.isPaused());
                        break;
                    case '⏹️':
                        queue.node.stop();
                        break;
                    case '⏭️':
                        if(queueHistory.nextTrack) {
                            queueHistory.next();
                        }
                        break;
                    case '🔀':
                        queue.tracks.shuffle();
                        break;
                    case '🔁':
                        queue.setRepeatMode(2);
                        break;
                    case '🔂':
                        queue.setRepeatMode(1);
                        break;
                }
            })
    }
}

export default event;