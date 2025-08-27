import { Client, Databases } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1") // replace with your endpoint
  .setProject("6894720600211b693b69"); // replace with your project ID

export const databases = new Databases(client);
