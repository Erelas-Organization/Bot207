import { promises as fsPromises } from "node:fs";
import { join } from "node:path";
import { color } from "../functions";
import { MusicPlayerEvent } from "../types";
import { Player } from "discord-player";

module.exports = async (player: Player) => {
    const eventsDirectory = join(__dirname, "../playerEvents");

    const files = await fsPromises.readdir(eventsDirectory);
    for (const file of files) {
        if (!file.endsWith(".js")) continue;
        const eventPath = join(eventsDirectory, file);
        const eventModule = await import(eventPath);
        const event: MusicPlayerEvent = eventModule.default;

        if (event.once) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            player.events.once(event.name, (...arguments_: any) => event.execute(...arguments_));
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            player.events.on(event.name, (...arguments_: any) => event.execute(...arguments_));
        }

        console.log(color("text", `🌠 Successfully loaded MusicEvent ${color("variable", event.name)}`));
    }
};
