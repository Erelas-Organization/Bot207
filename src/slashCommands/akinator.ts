import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../types";
import { Aki } from "aki-api";

const ClearCommand: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("akinator")
    .setDescription("Starts a new akinator game."),
  execute: async (interaction) => {
    const yesButton = new ButtonBuilder()
      .setCustomId("yes")
      .setLabel("Yes")
      .setStyle(ButtonStyle.Success);

    const noButton = new ButtonBuilder()
      .setCustomId("no")
      .setLabel("No")
      .setStyle(ButtonStyle.Danger);

    const dontKnowButton = new ButtonBuilder()
      .setCustomId("dontKnow")
      .setLabel("Don't Know")
      .setStyle(ButtonStyle.Primary);

    const probablyButton = new ButtonBuilder()
      .setCustomId("probably")
      .setLabel("Probably")
      .setStyle(ButtonStyle.Primary);

    const probablyNotButton = new ButtonBuilder()
      .setCustomId("probablyNot")
      .setLabel("ProbablyNot")
      .setStyle(ButtonStyle.Primary);

    const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      yesButton,
      noButton,
      dontKnowButton,
      probablyButton,
      probablyNotButton
    );

    const answerAkinator = (aki: Aki, answer: number) => {
      aki.step(answer).then((akiStep) => {
        if (aki.progress >= 70 || aki.currentStep >= 78) {
          console.log("WON");
          aki.win().then((guess) => {
            const character = guess.guesses[0];
            interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Akinator")
                  .setDescription(
                    `I think your character is ${character.name}!`
                  )
                  .setImage(character.absolute_picture_path),
              ],
              components: [],
            });
            collector.stop();
            console.log("STOPPED");
          });
        } else {
          interaction.editReply({
            embeds: [embed.setDescription(akiStep.question)],
          });
        }
      });
    };

    const embed = new EmbedBuilder()
      .setTitle("Akinator")
      .setDescription("Starting a new Akinator game...");
    const aki = new Aki({ region: "en", childMode: false });
    const response = await interaction.reply({
      embeds: [embed],
      components: [buttonRow],
    });
    await aki.start().then((akiStep) => {
      interaction.editReply({
        embeds: [embed.setDescription(akiStep.question)],
      });
    });
    const collector = response.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60_000,
    });
    collector.on("collect", async (interaction) => {
      switch (interaction.customId) {
        case "yes": {
          await answerAkinator(aki, 0);
          break;
        }
        case "no": {
          await answerAkinator(aki, 1);
          break;
        }
        case "dontKnow": {
          await answerAkinator(aki, 2);
          break;
        }
        case "probably": {
          await answerAkinator(aki, 3);
          break;
        }
        case "probablyNot": {
          await answerAkinator(aki, 4);
          break;
        }
      }
      console.log("Button return");
      interaction.deferUpdate();
      return;
    });
  },
  cooldown: 10,
};

export default ClearCommand;
