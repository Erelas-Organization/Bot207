import { Client } from "discord.js";
import { promises as fsPromises } from "fs";
import { join } from "path";
import { color } from "../functions";
import { BotEvent } from "../types";

module.exports = async (client: Client) => {
    const eventsDir = join(__dirname, "../events");

    const files = await fsPromises.readdir(eventsDir);
    for (const file of files) {
        if (!file.endsWith(".js")) continue;
        const eventPath = join(eventsDir, file);
        const eventModule = await import(eventPath);
        const event: BotEvent = eventModule.default;

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }

        console.log(color("text", `🌠 Successfully loaded event ${color("variable", event.name)}`));
    }
};
