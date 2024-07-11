const Redis = require("ioredis");
const { REDIS_URL } = require("../config");
const {
  changeBookingStatusDueToTTL,
} = require("../kafka/handlers/consumers/bookingConsumer");

let client;

function createRedisClient() {
  const newClient = new Redis();

  newClient.on("error", (error) => {
    console.log(`Redis connection error: ${error}`);

    // Attempt to re-create the Redis client after a delay (e.g., 5 seconds).
    setTimeout(() => {
      console.log("Attempting to reconnect to Redis...");
      client = createRedisClient();
    }, 5000);
  });

  newClient.on("connect", () => {
    console.log("Connected to Redis");
  });

  return newClient;
}

// Initialize the Redis client
client = createRedisClient();

// Function to acquire a lock using Redis SETNX (set if not exists)
async function acquireLock(key, ttl) {
  return new Promise((resolve, reject) => {
    client.set(key, "locked", "NX", "PX", ttl, (err, reply) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(reply === "OK");
      }
    });
  });
}

// Function to release a lock by deleting the key from Redis
async function releaseLock(key) {
  return new Promise((resolve, reject) => {
    client.del(key, (err, reply) => {
      if (err) {
        reject(err);
      } else {
        resolve(reply);
      }
    });
  });
}

// Function to set TTL for the SAGA
async function setTTL(key, ttl = 300) {
  return new Promise((resolve, reject) => {
    client.set(key, "1", "EX", ttl, (err, reply) => {
      if (err) {
        return reject(err);
      }
      resolve(reply);
    });
  });
}

// Create a separate client for listening to events
const subscriber = new Redis();
subscriber.subscribe("__keyevent@0__:expired");

subscriber.on("message", async (channel, message) => {
  if (channel === "__keyevent@0__:expired") {
    if (message.startsWith("ttl:booking:")) {
      const orderIdGateway = message.split(":")[2];
      await changeBookingStatusDueToTTL(orderIdGateway);
    }
  }
});

module.exports = {
  createRedisClient,
  acquireLock,
  releaseLock,
  setTTL,
};
