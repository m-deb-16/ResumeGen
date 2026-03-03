import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import resumeRoutes from "./routes/resumeRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); //why
app.use("/api/resume", resumeRoutes);

app.get("/", (req, res) => {
    res.send("hello there")
}); //diff between using router.get and app.get

app.listen(process.env.PORT, () => {
    console.log(`Sever running on port ${process.env.PORT}`);
}) //explore how callback functions work