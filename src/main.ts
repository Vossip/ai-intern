import dotenv from 'dotenv';
import fs from 'fs';
import devClient from './clients/devClient';
import { saveTweetsToFile, saveMediaLinksToFile } from './utils/fileUtils';

dotenv.config({ path: 'config/.env' });

const accountID = process.env.ACCOUNT_ID as string;

async function findByUserID() {
  try {
    const response = await devClient.tweets.usersIdTweets(accountID, {
      max_results: 100,
      'tweet.fields': ['id', 'text'],
      'media.fields': ['preview_image_url', 'type', 'url'],
      expansions: ['attachments.media_keys'],
      exclude: ['replies'],
      pagination_token: ''
    });

    console.dir(response, { depth: null });

    if (response.data) {
      // Create a map of media_key to media URL
      const mediaMap = new Map<string, string>();
      if (response.includes?.media) {
        response.includes.media.forEach((media: any) => {
          const mediaUrl = media?.preview_image_url || media?.url || '';
          if (media.media_key) {
            mediaMap.set(media.media_key, mediaUrl);
          }
        });
      }

      // Map each tweet to the desired format
      const tweets = response.data.map((tweet: any) => ({
        id: tweet.id,
        text: tweet.text,
        media: tweet.attachments?.media_keys?.map((media_key: string) => ({
          media_key,
          media_description: '', // Always set as an empty string
          url: mediaMap.get(media_key) || '' // Retrieve the preview_image_url from the map
        })) || []
      }));

      // Save the formatted tweets to a JSON file
      saveTweetsToFile('output/intern-tweets.json', tweets);

      // Extract media URLs and save them to a links.txt file with up to 10 links per row
      if (response.includes?.media) {
        const mediaUrls = response.includes.media
          .map((media: any) => media?.url || media?.preview_image_url)
          .filter((url: string) => url) as string[];
        saveMediaLinksToFile('output/links.txt', mediaUrls, 10);
      } else {
        console.log('No media found in the response.');
      }

    } else {
      console.log('No data available in the response.');
    }

  } catch (error) {
    console.error('Error fetching tweets:', error);
  }
}

async function main() {
  try {
    await findByUserID();
  } catch (error) {
    console.error('Error handling stream:', error);
  }
}

main();
