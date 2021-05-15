import express from "express";
import asyncHandler from "express-async-handler";
import cors from "cors";
import morgan from "morgan";
import { IndexFacesCommand, SearchFacesByImageCommand } from "@aws-sdk/client-rekognition";

import { rekognitionClient, COLLECTION_ID } from "./utils/api/rekognition/rekognition.js";
import { firestoreDB } from "./utils/api/firebase/fire.js";

const { PORT = 1729 } = process.env;

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ msg: "Hello!" });
});

app.post(
    "/saveImage",
    asyncHandler(async (req, res) => {
        const imageDocRef = firestoreDB.collection("images").doc();
        const { image, name } = req.body;
        const imageBytes = Buffer.from(image, "base64");

        const indexFacesCommand = new IndexFacesCommand({
            CollectionId: COLLECTION_ID,
            ExternalImageId: imageDocRef.id,
            Image: { Bytes: imageBytes },
        });

        await rekognitionClient.send(indexFacesCommand);

        await imageDocRef.set({
            collectionId: COLLECTION_ID,
            externalImageId: imageDocRef.id,
            name: name,
        });

        res.json({ externalImageId: imageDocRef.id });
    })
);

app.post(
    "/processImage",
    asyncHandler(async (req, res) => {
        const imageBytes = Buffer.from(req.body.image, "base64");
        const imageCollentionRef = firestoreDB.collection("images");

        const searchFacesByImageCommand = new SearchFacesByImageCommand({
            CollectionId: COLLECTION_ID,
            MaxFaces: 1,
            Image: { Bytes: imageBytes },
        });

        try {
            const { FaceMatches } = await rekognitionClient.send(searchFacesByImageCommand);
            const faceDetailsDocSnapShot = await imageCollentionRef.doc(FaceMatches[0].Face.ExternalImageId).get();

            res.json({ match: true, name: faceDetailsDocSnapShot.get("Name") });
        } catch {
            res.json({ match: false, msg: "no face found" });
        }
    })
);

app.use((err, req, res, next) => {
    console.log(err);
    res.json({ msg: err.name });
});

app.listen(PORT, async () => {
    console.log(`server is running on port: ${PORT}`);
});