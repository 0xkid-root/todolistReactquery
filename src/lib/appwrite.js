import { Client, Account, Databases } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('your-project-id'); // Replace with your project ID

export const account = new Account(client);
export const databases = new Databases(client);

export const DB_ID = 'your-database-id'; // Replace with your database ID
export const COLLECTION_ID = 'todos'; // Replace with your collection ID