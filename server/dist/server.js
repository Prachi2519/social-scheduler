import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
const app = express();
//DB connection
await connectDB();
// Middleware
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;
app.get("/", (_req, res) => {
    res.send("Server is Live!");
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
