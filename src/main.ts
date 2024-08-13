import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

import dev_client from './client/dev_client';

async function findByUserID() {
  try {
    const response = await dev_client.tweets.usersIdTweets("1354120919460040711", {
      "max_results": 100,
      "tweet.fields": [
        "id",
        "text"
      ],
      "media.fields": [
        "preview_image_url",
        "type",
        "url"
      ],
      "expansions": ["attachments.media_keys"],
      exclude: ["replies"],
      pagination_token: ""
    });

    console.dir(response, { depth: null });

    if (response.data) {

      // Map each tweet to the desired format
      const tweets = response.data.map(tweet => ({
        id: tweet.id,
        text: tweet.text
      }));

      if (response.data) {
        // Create a map of media_key to media description
        const mediaMap = new Map();
        if (response.includes && response.includes.media) {
          response.includes.media.forEach(media => {
            const description = media as { preview_image_url?: string; url?: string };
            const mediaUrl = description.preview_image_url || description.url || "";
            mediaMap.set(media.media_key, mediaUrl);
          });
        }
  
        // Map each tweet to the desired format
        const tweets = response.data.map(tweet => {
          const tweetMedia = tweet.attachments?.media_keys?.map(media_key => ({
            media_key,
            media_description: "", // Always set as an empty string
            url: mediaMap.get(media_key) || "" // Retrieve the preview_image_url from the map
          })) || [];
  
          return {
            id: tweet.id,
            text: tweet.text,
            media: tweetMedia
          };
        });
  
        // Save the formatted tweets to a JSON file
        fs.writeFileSync('intern-tweets.json', JSON.stringify(tweets, null, 4), 'utf8');
        console.log("Tweets have been saved to intern-tweets.json");
      } else {
        console.log("No data available in the response.");
      }

      // Extract media URLs and save them to a links.txt file with up to 10 links per row
      if (response.includes && response.includes.media) {
        const mediaUrls = response.includes.media.map(media => {
          // Cast the media object to a more specific type that includes the URL properties
          const photoMedia = media as { url?: string; preview_image_url?: string };
          return photoMedia.url || photoMedia.preview_image_url;
        }).filter(url => url);

        const chunkSize = 10;
        const mediaUrlsChunks = [];
        for (let i = 0; i < mediaUrls.length; i += chunkSize) {
          const chunk = mediaUrls.slice(i, i + chunkSize).join(',');
          mediaUrlsChunks.push(chunk);
        }

        fs.writeFileSync('links.txt', mediaUrlsChunks.join('\n'), 'utf8');
        console.log("Media URLs have been saved to links.txt with up to 10 links per row.");
      } else {
        console.log("No media found in the response.");
      }

    } else {
      console.log("No data available in the response.");
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
