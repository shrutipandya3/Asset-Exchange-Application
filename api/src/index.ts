import express from "express";
import { RedisManager } from "./RedisManager.js";
import type { PingMessage } from "./types/index.js";

const app = express();
app.use(express.json());

app.post("/api/v1/test-ping", async (req, res) => {
    const message1: Omit<PingMessage, "id"> = {
        type: "ping",
        payload: "hello from message 1"
    };

    const message2: Omit<PingMessage, "id"> = {
        type: "ping",
        payload: "hello from message 2"
    };

    try {
        const redisManager = RedisManager.getInstance();

        console.log("Sending message 1...");
        const response1 = await redisManager.sendAndAwait(message1);
        console.log("Got response for message 1:", response1);

        console.log("Sending message 2...");
        const response2 = await redisManager.sendAndAwait(message2);
        console.log("Got response for message 2:", response2);

        res.json({ response1, response2 });
    } catch (err) {
        console.error("Error running test:", err);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});