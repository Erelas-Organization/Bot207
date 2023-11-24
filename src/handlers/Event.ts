import { Client } from "discord.js";
import { promises as fsPromises } from "node:fs";
import { join } from "node:path";
import { color } from "../functions";
import { BotEvent } from "../types";

module.exports = async (client: Client) => {
    const eventsDirectory = join(__dirname, "../events");

    const files = await fsPromises.readdir(eventsDirectory);
    for (const file of files) {
        if (!file.endsWith(".js")) continue;
        const eventPath = join(eventsDirectory, file);
        const eventModule = await import(eventPath);
        const event: BotEvent = eventModule.default;

        if (event.once) {
            client.once(event.name, (...arguments_) => event.execute(...arguments_));
        } else {
            client.on(event.name, (...arguments_) => event.execute(...arguments_));
        }

        console.log(color("text", `🌠 Successfully loaded event ${color("variable", event.name)}`));
    }
};
