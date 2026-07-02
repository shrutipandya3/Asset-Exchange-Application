
import { createClient, type RedisClientType } from "redis";
import type { PingMessage } from "./types/index.js";

export class RedisManager {
    private client: RedisClientType;
    private publisher: RedisClientType;
    private static instance: RedisManager;

    private constructor() {
        this.client = createClient();
        this.client.connect();
        this.publisher = createClient();
        this.publisher.connect();
    }

    public static getInstance() {
        if (!this.instance)  {
            this.instance = new RedisManager();
        }
        return this.instance;
    }

    //TODO: add type here for engine message 
     public sendAndAwait(message: PingMessage): Promise<any> {
        return new Promise((resolve, reject) => {
            const id = this.getRandomClientId();
            const channel = `response:${id}`;

            const timeout = setTimeout(() => {
                this.client.unsubscribe(channel);
                reject(new Error(`Timeout waiting for response on ${channel}`));
            }, 5000);

            this.client.subscribe(channel, (reply) => {
                clearTimeout(timeout);
                this.client.unsubscribe(channel);
                resolve(JSON.parse(reply));
            });

            this.publisher.lPush(
                "order-queue",
                JSON.stringify({ ...message, id })
            );
        });
    }


    public getRandomClientId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

}