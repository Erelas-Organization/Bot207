import { Message } from "discord.js";
import { BotEvent } from "../types";

const stfuEvent: BotEvent = {
  name: "messageCreate",
  execute: async (message: Message) => {
    if (!message.author.bot && message.author.id === "440849314487468032") {
      try {
        const response = await fetch(`https://api.popcat.xyz/mock?text=${encodeURIComponent(message.content)}`);
        const data = await response.json();
        if (data.text) {
          await message.channel.send(`${data.text} - *in a mocking tone*`);
          await message.channel.send("stfu " + "<@" + message.author.id + ">");
        } 
      } catch (error) {
          console.error('Error mocking text:', error);
      }
    }
  },
};

export default stfuEvent;
