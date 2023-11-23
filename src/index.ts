import { Client, GatewayIntentBits, Collection, ActivityType} from "discord.js";
const { Guilds, MessageContent, GuildMessages, GuildMembers, GuildMessageReactions } = GatewayIntentBits
const client = new Client({intents:[Guilds, MessageContent, GuildMessages, GuildMembers, GuildMessageReactions]})
import { Command, SlashCommand } from "./types";
import { config } from "dotenv";
import { promises as fsPromises } from "fs";
import { join } from "path";
config();

client.slashCommands = new Collection<string, SlashCommand>();
client.commands = new Collection<string, Command>();
client.cooldowns = new Collection<string, number>();

const handlersDir = join(__dirname, "./handlers");

async function loadHandlers() {
    const handlers = await fsPromises.readdir(handlersDir);
    await Promise.all(handlers.map(async handler => {
        if (handler.endsWith(".js")) {
            const handlerPath = join(handlersDir, handler);
            const importedHandler = await import(handlerPath);
            importedHandler.default(client);
        }
    }));
}

client.on('ready', () => {
    if (client.user) {
        client.user.setActivity({
            name: `With Your Mom`, 
            type: ActivityType.Streaming 
        });
    }
});

loadHandlers().then(() => {
    client.login(process.env.TOKEN);
}).catch(error => {
    console.error("Handler loading error:", error);
});
