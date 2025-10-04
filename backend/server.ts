import express from "express";
import type { Request, Response } from "express";
import { nanoid } from "nanoid"
import cors from "cors";
import { PrismaClient, type Link } from "@prisma/client";

const app = express();
const port: number = 3000;

const prisma = new PrismaClient();

app.use(cors({
    origin: "http://localhost:5173", // your frontend URL
}));
// Middleware to parse JSON
app.use(express.json());

// POST /shorten -> create a short URL
app.post("/shorten", async (req: Request, res: Response) => {
    const { longUrl } = req.body as { longUrl: string };

    if (!longUrl) {
        return res.status(400).json({ error: "longUrl is required" });
    }

    // Generate Unique ShortID
    let shortID = nanoid(6);

    // Check For Collisions
    while (await prisma.link.findUnique({ where: { shortCode: shortID } })) {
        shortID = nanoid(6);
    }

    // Save Mapping
    const newLink: Link = await prisma.link.create({
        data: {
            url: longUrl,
            shortCode: shortID,
            createdAt: new Date(),
            expiryDate: new Date(Date.now() +  60 * 1000),
        },
    })

    return res.json({ shortUrl: `http://localhost:${port}/${shortID}` });
});

// GET /:shortID -> redirect
app.get("/:shortID", async (req: Request, res: Response) => {
    const { shortID } = req.params;
    const record = await prisma.link.findUnique({
        where: { shortCode: shortID },
    });

    if (!record) {
        return res.status(404).json({ error: "Short URL not found" });
    }

    // Check expiry
    if (record.expiryDate < new Date()) {
        return res.status(410).json({ error: "Short URL expired" }); // 410 = Gone
    }

    res.redirect(record.url);
});

// GET route
app.get("/", (req: Request, res: Response) => {
    res.send("QuickLink: Url Shortener is running!");
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});