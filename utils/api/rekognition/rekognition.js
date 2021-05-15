import { RekognitionClient, CreateCollectionCommand, DeleteCollectionCommand } from "@aws-sdk/client-rekognition";

const client = new RekognitionClient({
    region: "ap-south-1",
    credentials: {
        accessKeyId: "AKIAX7RF22LFG3IJVBIF",
        secretAccessKey: "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",
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
