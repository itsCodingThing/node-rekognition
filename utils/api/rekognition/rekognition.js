import { RekognitionClient, CreateCollectionCommand, DeleteCollectionCommand } from "@aws-sdk/client-rekognition";

const client = new RekognitionClient({
    region: "ap-south-1",
    credentials: {
        accessKeyId: "aws access key id needed",
        secretAccessKey: "aws secret access key needed",
    },
});

export const COLLECTION_ID = "my_collection";

const createCollectionCommand = new CreateCollectionCommand({ CollectionId: COLLECTION_ID });
const deleteCollecitonCommand = new DeleteCollectionCommand({ CollectionId: COLLECTION_ID });

try {
    await client.send(createCollectionCommand);
} catch {
    await client.send(deleteCollecitonCommand);
    await client.send(createCollectionCommand);
}

export const rekognitionClient = client;
