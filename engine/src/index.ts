import { createClient } from "redis";
import { RedisManager } from "./RedisManager.js";


async function main() {
 const redisManager = RedisManager.getInstance();

    while (true) {
        const response = await redisManager.client.rPop("messages" as string)
        if (!response) {
            continue;
        }  else {
            const message: PingMessage = JSON.parse(response.element);
        await process(message);
        }        
    }

}

main();