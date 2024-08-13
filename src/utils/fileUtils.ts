import fs from 'fs';

export function saveTweetsToFile(filePath: string, tweets: any[]) {
  fs.writeFileSync(filePath, JSON.stringify(tweets, null, 4), 'utf8');
  console.log(`Tweets have been saved to ${filePath}`);
}

export function saveMediaLinksToFile(filePath: string, mediaUrls: string[], chunkSize: number) {
  const mediaUrlsChunks = [];
  for (let i = 0; i < mediaUrls.length; i += chunkSize) {
    const chunk = mediaUrls.slice(i, i + chunkSize).join(',');
    mediaUrlsChunks.push(chunk);
  }

  fs.writeFileSync(filePath, mediaUrlsChunks.join('\n'), 'utf8');
  console.log(`Media URLs have been saved to ${filePath} with up to ${chunkSize} links per row.`);
}
