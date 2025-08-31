import "dotenv/config";
import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth";
import { membersRouter } from "./routes/members";
import { resourcesRouter } from "./routes/resources";
import { eventsRouter } from "./routes/events";

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/members", membersRouter);
app.use("/api/resources", resourcesRouter);
app.use("/api/events", eventsRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
