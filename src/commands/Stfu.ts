import { Guild, GuildMember, PermissionFlagsBits } from "discord.js";
import { Command } from "../types";
const command : Command = {
    name: "stfu",
    execute: (message, args) => {
        let usertoMute = message.mentions.members?.first()
        let roleMuted = message.guild?.roles.cache.find(role => role.name === "Muted")  
        if(usertoMute && roleMuted){
            usertoMute.roles.add(roleMuted).then(() => {message.channel.send("Shut the fuck up" +  "<@" + usertoMute?.user.id + ">")})
        }
    },
    cooldown: 0,
    aliases: [],
    permissions: ["Administrator", PermissionFlagsBits.ManageEmojisAndStickers]
}
export default command 
