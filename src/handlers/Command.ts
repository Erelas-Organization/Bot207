import { Client, Routes, SlashCommandBuilder } from "discord.js";
import { REST } from "@discordjs/rest";
import { promises as fsPromises } from "fs";
import { join } from "path";
import { color } from "../functions";
import { Command, SlashCommand } from "../types";

module.exports = async (client : Client) => {
    const slashCommands : SlashCommandBuilder[] = [];
    const commands : Command[] = [];

    const slashCommandsDir = join(__dirname, "../slashCommands");
    const commandsDir = join(__dirname, "../commands");

    const loadSlashCommands = async () => {
        const files = await fsPromises.readdir(slashCommandsDir);
        await Promise.all(files.map(async file => {
            if (file.endsWith(".js")) {
                const filePath = join(slashCommandsDir, file);
                const command : SlashCommand = (await import(filePath)).default;
                slashCommands.push(command.command);
                client.slashCommands.set(command.command.name, command);
            }
        }));
    };

    const loadCommands = async () => {
        const files = await fsPromises.readdir(commandsDir);
        await Promise.all(files.map(async file => {
            if (file.endsWith(".js")) {
                const filePath = join(commandsDir, file);
                const command : Command = (await import(filePath)).default;
                commands.push(command);
                client.commands.set(command.name, command);
            }
        }));
    };

    await loadSlashCommands();
    await loadCommands();

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    try {
        const data = await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
            body: slashCommands.map(command => command.toJSON())
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any[];

        console.log(color("text", `🔥 Successfully loaded ${color("variable", data.length)} slash command(s)`));
        console.log(color("text", `🔥 Successfully loaded ${color("variable", commands.length)} command(s)`));
    } catch (e) {
        console.error(e);
    }
};
