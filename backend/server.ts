import express from "express";
import type { Request, Response } from "express";
import "./db"; // import connection

const app = express();
const port: number = 3000;

// Middleware to parse JSON
app.use(express.json());

// GET route
app.get("/", (req: Request, res: Response) => {
    res.send("Hello from Bun Backend with MongoDB!");
});

// POST route
app.post("/greet", (req: Request, res: Response) => {
    const { name } = req.body;
    const { age } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }
    res.json({ message: `Hello, ${name}! You're ${age} years old!` });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});