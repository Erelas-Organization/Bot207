import { Command } from "../types";
const command : Command = {
    name: "unmute",
    execute: (message) => {
        let userToUnmute = message.mentions.members?.first()
        let roleMuted = message.guild?.roles.cache.find(role => role.name === "Muted")  
        if(userToUnmute && roleMuted){
            userToUnmute.roles.remove(roleMuted).then(() => {message.channel.send("You are unmuted" +  "<@" + userToUnmute?.user.id + ">")})
        }
    },
    cooldown: 0,
    aliases: [],
    permissions: []
}
export default command 
