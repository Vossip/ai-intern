import dotenv from 'dotenv';
dotenv.config();

import { Client, auth } from 'twitter-api-sdk';

const bearerToken = process.env.BEARER_TOKEN as string;

/* const authClient = new auth.OAuth2User({
  client_id: process.env.CLIENT_ID as string,
  client_secret: process.env.CLIENT_SECRET as string,
  callback: "http://127.0.0.1:3000/callback",
  scopes: ["tweet.read", "users.read", "offline.access"],
});

const client = new Client(authClient);
 */
const client = new Client(bearerToken);

export default client;
