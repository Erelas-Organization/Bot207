import { GuildMember, PermissionFlagsBits } from "discord.js";
import { Command } from "../types";
const command : Command = {
    name: "keks",
    execute: (message) => {
        let keksList = ["290865364328251393", "699913010969575537", "440849314487468032", "265204506839613443"]
        let filtered = keksList.filter((x) => x !== message.author.id).map((x) => "<@" + x + ">").join(" ");
        message.channel.send("Valo / CS ?" +  filtered);
    },
    cooldown: 0,
    aliases: [],
    permissions: []
}
export default command 
