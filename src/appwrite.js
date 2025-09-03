import { Client, Databases, Query } from "node-appwrite";

// ---------- Appwrite Setup ----------
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6894720600211b693b69"); // same as frontend

const databases = new Databases(client);

const DATABASE_ID = "6894724e002dc704b552"; // your DB
const LESSONS_COLLECTION_ID = "lessons";    // your lessons collection
