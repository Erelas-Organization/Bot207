import { promises as fsPromises } from "fs";
import { join } from "path";
import { color } from "../functions";
import { MusicPlayerEvent } from "../types";
import { Player } from "discord-player";

module.exports = async (player: Player) => {
    const eventsDir = join(__dirname, "../playerEvents");

    const files = await fsPromises.readdir(eventsDir);
    for (const file of files) {
        if (!file.endsWith(".js")) continue;
        const eventPath = join(eventsDir, file);
        const eventModule = await import(eventPath);
        const event: MusicPlayerEvent = eventModule.default;

        if (event.once) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            player.events.once(event.name, (...args: any) => event.execute(...args));
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            player.events.on(event.name, (...args: any) => event.execute(...args));
        }

        console.log(color("text", `🌠 Successfully loaded MusicEvent ${color("variable", event.name)}`));
    }
};
