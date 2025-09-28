import { Client, Databases, ID } from "node-appwrite";

// Initialize Appwrite client
const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("6894720600211b693b69")
  .setKey(
    "standard_ddaca04e6330b4b5df682053f90a70286aee58e871d422cdb963963aaf1c770093c66c1145ef35956dbd592d6009bd14f46626fca14866cc46373580cdaf075c8aaf9d8dcb1a77f081dae59ad666c6fa4dd9daf00b9d54d87479cd4e72c4fcbab6f2f9264a2e78d5ce93a23080dfc23a15b3e299ad19b3095e45cef8bfff0382"
  );

const databases = new Databases(client);
const databaseId = "6894724e002dc704b552";
const collectionId = "mindmap";

// ✅ Function to create sections for Module 1
async function createModule1() {
  const moduleId = "1";
  const title = "Module 1 – Comply With Emergency Procedures";

  const sections = [
    {
      section_id: "1",
      url:
        "https://fra.cloud.appwrite.io/v1/storage/buckets/68d80d28002f43de92cb/files/68d8eac90008832c3456/view?project=6894720600211b693b69&mode=admin",
    },
    {
      section_id: "2",
      url:
        "https://fra.cloud.appwrite.io/v1/storage/buckets/68d80d28002f43de92cb/files/68d8ead10023789a673c/view?project=6894720600211b693b69&mode=admin",
    },
    {
      section_id: "3",
      url:
        "https://fra.cloud.appwrite.io/v1/storage/buckets/68d80d28002f43de92cb/files/68d8ead8000e7e7047a5/view?project=6894720600211b693b69&mode=admin",
    },
    {
      section_id: "4",
      url:
        "https://fra.cloud.appwrite.io/v1/storage/buckets/68d80d28002f43de92cb/files/68d8eae0000369d93959/view?project=6894720600211b693b69&mode=admin",
    },
    
  ];

  for (const section of sections) {
    try {
      const response = await databases.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        {
          module_id: moduleId,
          title: title,
          sections: section.url, // Only URL
          section_id: section.section_id,
        }
      );
      console.log(`✅ Module 1 Section ${section.section_id} created:`, response.$id);
    } catch (error) {
      console.error(`❌ Failed to create Module 1 Section ${section.section_id}:`, error);
    }
  }
}

// ✅ Function to create sections for Module 2
async function createModule2() {
  const moduleId = "2";
  const title = "PSSR – Prevent Pollution of Marine Environment";

  const sections = [
    {
      section_id: "1",
      url:
        "https://fra.cloud.appwrite.io/v1/storage/buckets/68d80d28002f43de92cb/files/68d80f7900256ea8d8bb/view?project=6894720600211b693b69&mode=admin",
    },
    {
      section_id: "2",
      url:
        "https://fra.cloud.appwrite.io/v1/storage/buckets/68d80d28002f43de92cb/files/68d80f8200209b4d6f27/view?project=6894720600211b693b69&mode=admin",
    },
    {
      section_id: "3",
      url:
        "https://fra.cloud.appwrite.io/v1/storage/buckets/68d80d28002f43de92cb/files/68d80f98001f82d9b7fd/view?project=6894720600211b693b69&mode=admin",
    },
    {
      section_id: "4",
      url:
        "https://fra.cloud.appwrite.io/v1/storage/buckets/68d80d28002f43de92cb/files/68d80fa20034563fc947/view?project=6894720600211b693b69&mode=admin",
    },
    {
      section_id: "5",
      url:
        "https://fra.cloud.appwrite.io/v1/storage/buckets/68d80d28002f43de92cb/files/68d80fa20034563fc947/view?project=6894720600211b693b69&mode=admin",
    },
  ];

  for (const section of sections) {
    try {
      const response = await databases.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        {
          module_id: moduleId,
          title: title,
          sections: section.url, // Only URL
          section_id: section.section_id,
        }
      );
      console.log(`✅ Module 2 Section ${section.section_id} created:`, response.$id);
    } catch (error) {
      console.error(`❌ Failed to create Module 2 Section ${section.section_id}:`, error);
    }
  }
}

// ✅ Run both modules
async function main() {
  await createModule1();
  await createModule2();
}

main();
