import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, 'tweets.txt');

// Read the content of the file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Parse the JSON content
  let tweets;
  try {
    tweets = JSON.parse(`[${data}]`); // Adding brackets to make it a valid JSON array
  } catch (parseErr) {
    console.error('Error parsing JSON:', parseErr);
    return;
  }

  // Remove the "id" and "edit_history_tweet_ids" fields from each tweet
  const modifiedTweets = tweets.map((tweet: any) => {
    const { id, edit_history_tweet_ids, ...rest } = tweet;
    return rest;
  });

  // Convert the modified tweets back to a JSON string
  const modifiedData = modifiedTweets.map((tweet: any) => JSON.stringify(tweet, null, 2)).join(',\n');

  // Write the modified content back to the file
  fs.writeFile(filePath, modifiedData, 'utf8', (writeErr) => {
    if (writeErr) {
      console.error('Error writing to the file:', writeErr);
    } else {
      console.log('File has been modified successfully.');
    }
  });
});
