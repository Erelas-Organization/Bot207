import { Client, Routes, SlashCommandBuilder } from "discord.js";
import { REST } from "@discordjs/rest";
import { promises as fsPromises } from "node:fs";
import { join } from "node:path";
import { color } from "../functions";
import { Command, SlashCommand } from "../types";

module.exports = async (client : Client) => {
    const slashCommands : SlashCommandBuilder[] = [];
    const commands : Command[] = [];

    const slashCommandsDirectory = join(__dirname, "../slashCommands");
    const commandsDirectory = join(__dirname, "../commands");

// Function to recursively load commands from a directory
async function loadCommandsFromDirectory(directory: string) {
    const files = await fsPromises.readdir(directory, { withFileTypes: true });
    for (const file of files) {
        if (file.isDirectory()) {
            await loadCommandsFromDirectory(join(directory, file.name));
        } else if (file.name.endsWith(".js") || file.name.endsWith(".ts")) {
            const filePath = join(directory, file.name);
            const fileImport = await import(filePath);
            if (directory.includes('slashCommands')) {
                const command: SlashCommand = fileImport.default;
                slashCommands.push(command.command);
                client.slashCommands.set(command.command.name, command);
            } else {
                const command: Command = fileImport.default;
                commands.push(command);
                client.commands.set(command.name, command);
            }
        }
    }
}

await loadCommandsFromDirectory(commandsDirectory);
await loadCommandsFromDirectory(slashCommandsDirectory);

    if(process.env.TOKEN && process.env.CLIENT_ID){
    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    try {
        const data = await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
            body: slashCommands.map(command => command.toJSON())
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any[];

        console.log(color("text", `🔥 Successfully loaded ${color("variable", data.length)} slash command(s)`));
        console.log(color("text", `🔥 Successfully loaded ${color("variable", commands.length)} command(s)`));
    } catch (error) {
        console.error(error);
    }}
};
