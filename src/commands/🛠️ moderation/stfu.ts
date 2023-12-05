import { Command } from "../../types";
const command : Command = {
    name: "stfu",
    execute: (message) => {
        const userToMute = message.mentions.members?.first()
        const roleMuted = message.guild?.roles.cache.find(role => role.name === "Muted")  
        if(userToMute && roleMuted){
            userToMute.roles.add(roleMuted).then(() => {message.channel.send("You are muted " +  "<@" + userToMute?.user.id + ">")})
        }
    },
    cooldown: 0,
    aliases: [],
    permissions: []
}
export default command 
