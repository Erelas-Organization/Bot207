import axios from "axios";
import * as cheerio from 'cheerio';

const searchUrl = 'https://api.genius.com/search?q=';

async function searchSong(title: string, artist: string, apiKey: string) {
    const song = `${title} ${artist}`;
    const requestUrl = `${searchUrl}${encodeURIComponent(song)}`;
    const { data } = await axios.get(`${requestUrl}&access_token=${apiKey}`);
    
    if (data.response.hits.length === 0) {
        throw new Error('No search results found for the song.');
    }

    const results = data.response.hits.map((value: { result: { full_title: string; song_art_image_url: string; id: number; url: string; }; }) => {
        const { full_title, song_art_image_url, id, url } = value.result;
        return { id, title: full_title, albumArt: song_art_image_url, url };
    });

    return results;
}

async function extractLyrics(url: string) {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    let lyrics = $('div[class="lyrics"]').text().trim();

    if (!lyrics) {
        lyrics = '';
        $('div[class^="Lyrics__Container"]').each((index, element) => {
            if ($(element).text().length > 0) {
                const snippet = $(element).html()!
                    .replace(/<br>/g, '\n')
                    .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, '');
                lyrics += $('<textarea/>').html(snippet).text().trim() + '\n\n';
            }
        });
    }

    if (!lyrics) {
        throw new Error('Lyrics not found for the song.');
    }

    return lyrics.trim();
}

export async function getLyrics(song: string, artist: string) {
    if (!process.env.GENIUS_API_KEY) {
        throw new Error('No Genius API key provided.');
    }

    const results = await searchSong(song, artist, process.env.GENIUS_API_KEY);
    const lyrics = await extractLyrics(results[0].url);
    return lyrics;
}
