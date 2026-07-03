import { createClient, type RedisClientType } from "redis";
import type { PingMessage } from "./types/index.js";

export class RedisManager {
    public client: RedisClientType;
    private publisher: RedisClientType;
    private static instance: RedisManager;

    private constructor() {
        this.client = createClient();
        this.client.connect();
        this.publisher = createClient();
        this.publisher.connect();
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new RedisManager();
        }
        return this.instance;
    }

    public async startProcessing() {
        while (true) {
            const response = await this.client.brPop("order-queue", 0);
            if (!response) continue;

            const message: PingMessage = JSON.parse(response.element);
            this.process(message);
        }
    }

    private process(message: PingMessage) {
        setTimeout(async () => {
            await this.publisher.publish(
                `response:${message.id}`,
                JSON.stringify({ executed: true, payload: message.payload, id: message.id })
            );
        }, 1000);
    }
}