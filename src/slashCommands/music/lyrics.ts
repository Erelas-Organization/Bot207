import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types";
import { getLyrics } from "../../utils/getLyrics";
import { useQueue } from "discord-player";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("lyrics")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("The song to get the lyrics for")
        .setRequired(false)
    )
    .setDescription(
      "Gets the lyrics for the current song or the song specified"
    ),

  execute: async (interaction) => {
    const queue = useQueue(interaction.guildId!);
    const song = interaction.options.getString("song");
    const currentTrack = queue?.currentTrack;
    let title = "";
    let lyrics = "";

    try {
      await interaction.reply({
        embeds: [new EmbedBuilder().setTitle("Fetching lyrics")],
        ephemeral: true,
      });
      if (song) {
        lyrics = await getLyrics(song, "");
        title = `Lyrics | ${song}`;
      } else if (currentTrack) {
        lyrics = await getLyrics(currentTrack.title, currentTrack.author);
        title = `Lyrics | ${currentTrack.title}`;
      } else {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Couldn't fetch lyrics")
              .setDescription(
                "No song specified. Please specify a song or start the player."
              ),
          ],
        });
      }
      const embed = new EmbedBuilder().setTitle(title).setDescription(lyrics);
      return interaction.editReply({ embeds: [embed] });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while fetching lyrics.";
      return interaction.editReply({
        embeds: [
          new EmbedBuilder().setTitle("Error").setDescription(errorMessage),
        ],
      });
    }
  },

  cooldown: 10,
};

export default command;
