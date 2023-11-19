import { GuildMember, PermissionFlagsBits } from "discord.js";
import { Command } from "../types";
const command : Command = {
    name: "whoIsBot",
    execute: (message) => {
        let toBotList = message.mentions.members
        if(toBotList?.size === 0){
            message.channel.send("Gib einen User ein du Hund!");
        } else if (toBotList?.size === 1){
            let mention: string = "<@" + toBotList.first()?.user.id + ">";
            message.channel.send(mention + " is a bot.");
        }else if(toBotList && toBotList.size > 1){
           let random = Math.floor(Math.random() * (toBotList.size))
           message.channel.send("<@" + toBotList.at(random)?.user.id + ">" + " ist ein Bot"); 
        }
    },
    cooldown: 0,
    aliases: [],
    permissions: []
}

export default command 
