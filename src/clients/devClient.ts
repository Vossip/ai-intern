import dotenv from 'dotenv';
dotenv.config();

import { Client } from 'twitter-api-sdk';

const bearerToken = process.env.BEARER_TOKEN;

if (!bearerToken) {
  throw new Error('BEARER_TOKEN is not defined in the environment variables.');
}

const client = new Client(bearerToken);

export default client;
