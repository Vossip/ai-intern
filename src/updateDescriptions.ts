import fs from 'fs';

interface Media {
  media_key: string;
  media_description: string;
}

interface Tweet {
  id: string;
  text: string;
  media: Media[];
}

// Load the descriptions from the file and filter out any empty lines
const descriptions = fs.readFileSync('output/descriptions.txt', 'utf8')
  .split('\n')
  .filter(description => description.trim() !== ''); // Filter out empty lines

// Load the intern-tweets.json file
const tweets: Tweet[] = JSON.parse(fs.readFileSync('output/intern-tweets.json', 'utf8'));

// Iterate over each tweet
let descriptionIndex = 0;
tweets.forEach((tweet: Tweet) => {
  tweet.media.forEach((media: Media) => {
    // Only update if there's a description available
    if (descriptionIndex < descriptions.length) {
      media.media_description = descriptions[descriptionIndex];
      descriptionIndex++;
    }
  });
});

// Save the updated tweets back to the intern-tweets.json file
fs.writeFileSync('output/intern-tweets.json', JSON.stringify(tweets, null, 2), 'utf8');

console.log('Descriptions have been updated in intern-tweets.json');
