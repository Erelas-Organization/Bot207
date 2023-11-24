import { EmbedBuilder, Message, MessageReaction, User} from "discord.js";
import { MusicPlayerEvent } from "../types";
import { GuildQueue, useHistory } from "discord-player";

const event: MusicPlayerEvent = {
    name: "queueCreate",
    execute: async (queue: GuildQueue<Message>) => {
        console.log("QueueCreate event fired")
        const message = queue.metadata.channel.messages.cache.get(queue.metadata.id);
        const queueHistory = useHistory(queue);
        const embed = new EmbedBuilder()
        .setTitle("Intializing queue and controls...")
        const clearUserReactions = async () => {
            if (message) {
                const reactions = message.reactions.cache.values();
                for (const reaction of reactions) {
                    try {
                        // Fetch users who reacted with this emoji
                        const users = await reaction.users.fetch();
                        // Remove reaction for each non-bot user
                        users.forEach(user => {
                            if (!user.bot){
                                reaction.users.remove(user.id)
                            }
                        });
                    } catch (error) {
                        console.error('Failed to remove reactions:', error);
                    }
                }
            }
        };
        if(!message) {
            return console.log("Message couldnt be created after enqueue");
        }
        message.edit({embeds: [embed]});
        message.react('⏮️')
			.then(() => message.react('⏯️'))
			.then(() => message.react('⏹️'))
            .then(() => message.react('⏭️'))
            .then(() => message.react('🔀'))
            .then(() => message.react('🔁'))
            .then(() => message.react('🔂'))
            .then(() => message.react('🔉'))
            .then(() => message.react('🔊'))
			.catch(error => console.error('One of the emojis failed to react:', error));
            const collector = message.createReactionCollector();
            collector.on('collect', async (reaction: MessageReaction, user: User) => {
                if(user.bot || !queue || !queueHistory) return;
                switch(reaction.emoji.name){
                    case '⏮️': {
                        if(queueHistory.previousTrack){
                        queueHistory.back();
                    }
                        break;
                    }
                    case '⏯️': {
                        queue.node.setPaused(!queue.node.isPaused());
                        break;
                    }
                    case '⏹️': {
                        queue.node.stop();
                        collector.stop();
                        break;
                    }
                    case '⏭️': {
                        if(queueHistory.nextTrack) {
                            console.log("Skipping to " + queueHistory.nextTrack.title)
                            queueHistory.next();
                        }
                        break;
                    }
                    case '🔀': {
                        queue.tracks.shuffle();
                        if(message.embeds.length > 0 && queue.history.nextTrack) {
                            const oldEmbed = message.embeds[0];
                            const newEmbed = new EmbedBuilder(oldEmbed.toJSON());
                            newEmbed.setFooter({ text: 'Up next: ' + queue.history.nextTrack.title, iconURL: queue.history.nextTrack.thumbnail });
                            message.edit({ embeds: [newEmbed] });
                        }
                        break;
                    }
                    case '🔁': {
                        queue.setRepeatMode(2);
                        break;
                    }
                    case '🔂': {
                        queue.setRepeatMode(1);
                        break;
                    }
                    case '🔉': {
                        queue.node.setVolume(queue.node.volume - 10);
                        break;
                    }
                    case '🔊': {
                        queue.node.setVolume(queue.node.volume + 10);
                        break;
                    }
                }
                await clearUserReactions();
            })
    }
}

export default event;