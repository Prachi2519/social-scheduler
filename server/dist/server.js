import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import socialAuthRoutes from "./routes/socialAuthRoutes.js";
import accountRouter from "./routes/accountRoutes.js";
import postRouter from "./routes/postRoutes.js";
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
app.use("/api/auth", authRouter);
app.use("/api/oauth", socialAuthRoutes);
app.use("/api/accounts", accountRouter);
app.use("/api/posts", postRouter);
//global error handler
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).send(err?.response?.data?.message || err?.message);
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
