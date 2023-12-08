import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../types";
import { Aki } from "aki-api";

const ClearCommand: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("akinator")
    .setDescription("Starts a new akinator game."),
  execute: async (interaction) => {
    const buttons = ["yes", "no", "dontKnow", "probably", "probablyNot"].map(
      (id) =>
        new ButtonBuilder()
          .setCustomId(id)
          .setLabel(id.charAt(0).toUpperCase() + id.slice(1))
          .setStyle(
            id === "yes"
              ? ButtonStyle.Success
              : (id === "no"
              ? ButtonStyle.Danger
              : ButtonStyle.Primary)
          )
    );

    const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      buttons
    );

    const answerAkinator = async (aki: Aki, answer: number) => {
      const question = await aki.step(answer);

      if (aki.progress >= 85 || aki.currentStep >= 78) {
        const guess = await aki.win();
        const character = guess.guesses[0];
        console.log(character);
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Akinator")
              .setDescription(`I think your character is ${character.name}!`)
              .setImage(character.absolute_picture_path),
          ],
          components: [],
        });
        collector.stop();
      } else {
        await interaction.editReply({
          embeds: [embed.setDescription(question.question)],
        });
      }
    };
    const embed = new EmbedBuilder()
      .setTitle("Akinator")
      .setThumbnail("https://play-lh.googleusercontent.com/rjX8LZCV-MaY3o927R59GkEwDOIRLGCXFphaOTeFFzNiYY6SQ4a-B_5t7eUPlGANrcw")
      .setDescription("Starting a new Akinator game...");
    const aki = new Aki({ region: "en", childMode: false });
    const response = await interaction.reply({
      embeds: [embed],
    });
    const akiUser = await interaction.user

    const question = await aki.start();

    interaction.editReply({
      embeds: [embed.setDescription(question.question)],
      components: [buttonRow],
    });

    const collector = response.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 900_000,
    });
    collector.on("collect", async (interaction) => {
        if(interaction.user.id !== akiUser.id){
            interaction.reply({content: "You did not start this game!", ephemeral: true});
            return;
        }
        interaction.deferUpdate();
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
      return;
    });
  },
  cooldown: 10,
};

export default ClearCommand;
