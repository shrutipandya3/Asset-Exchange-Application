import { RedisManager } from "./RedisManager.js";

async function main() {
    const redisManager = RedisManager.getInstance();
    await redisManager.startProcessing();
}

main();