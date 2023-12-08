import { Command } from "../../types";
const command : Command = {
    name: "unmute",
    execute: (message) => {
        const userToUnmute = message.mentions.members?.first()
        const roleMuted = message.guild?.roles.cache.find(role => role.name === "Muted")  
        if(userToUnmute && roleMuted){
            userToUnmute.roles.remove(roleMuted).then(() => {message.channel.send("You are unmuted" +  "<@" + userToUnmute?.user.id + ">")})
        }
    },
    cooldown: 0,
    aliases: [],
    permissions: []
}
export default command 
