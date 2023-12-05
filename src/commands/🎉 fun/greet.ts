import { Command } from "../../types";

const command : Command = {
    name: "greet",
    execute: (message) => {
        const toGreetList = message.mentions.members
        message.channel.send(`Hello there ${toGreetList?.size ? toGreetList.map((user) => {return "<@" + user.user.id + ">"}).join(", ") : "<@" + message.member?.user.id + ">"} !`)
    },
    cooldown: 10,
    aliases: [],
    permissions: []
}

export default command 
