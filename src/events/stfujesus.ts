import { Message } from "discord.js";
import { BotEvent } from "../types";

const stfuEvent: BotEvent = {
  name: "messageCreate",
  execute: async (message: Message) => {
    if (!message.author.bot) {
      if (message.author.id === "440849314487468032") {
        message.channel.send("stfu " + "<@" + message.author.id + ">");
      }
    }
  },
};

export default stfuEvent;
