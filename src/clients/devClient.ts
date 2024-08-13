import dotenv from 'dotenv';
dotenv.config();

import { Client, auth } from 'twitter-api-sdk';

const bearerToken = process.env.BEARER_TOKEN as string;
const client = new Client(bearerToken);

export default client;
