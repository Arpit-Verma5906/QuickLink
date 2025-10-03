import express from "express";
import type { Request, Response } from "express";
import { connectDB, urls } from "./db"; // import connection
import { nanoid } from "nanoid"

const app = express();
const port: number = 3000
;

// Middleware to parse JSON
app.use(express.json());

// connect to MongoDB
await connectDB();

// POST /shorten -> create a short URL
app.post("/shorten", async (req: Request, res: Response) => {
    const { longUrl } = req.body as { longUrl: string};

    if(!longUrl) {
        return res.status(400).json({error: "longUrl is required" });
    }

    // Generate Unique ShortID
    let shortID = nanoid(6);

    // Check For Collisions
    while (await urls.findOne({ shortID })) {
        shortID = nanoid(6);
    }

    // Save Mapping
    await urls.insertOne({ shortID, longUrl, createdAt: new Date(), expiryDate: new Date(Date.now() + 1000 * 60) });

    return res.json({ shortUrl: `http:localhost:${port}/${shortID}`});
});

// GET /:shortID -> redirect
app.get("/:shortID", async (req: Request, res: Response) => {
    const {shortID} = req.params;
    const record = await urls.findOne({ shortID });

    if(!record) {
        return res.status(404).json({ error: "Short URL not found"});
    }

    res.redirect(record.longUrl);
});

// GET route
app.get("/", (req: Request, res: Response) => {
    res.send("QuickLink: Url Shortener is running!");
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});