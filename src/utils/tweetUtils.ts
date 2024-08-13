interface Media {
    media_key: string;
    media_description: string;
    preview_image_url?: string;
}

interface Tweet {
    id: string;
    text: string;
    media: Media[];
}

export const updateTweetDescriptions = (tweets: Tweet[], descriptions: string[]): Tweet[] => {
    let descriptionIndex = 0;
    tweets.forEach(tweet => {
        tweet.media.forEach(media => {
            if (descriptionIndex < descriptions.length) {
                media.media_description = descriptions[descriptionIndex];
                descriptionIndex++;
            }
        });
    });
    return tweets;
};