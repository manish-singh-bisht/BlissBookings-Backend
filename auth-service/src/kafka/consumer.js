const { deleteUserInDatabase } = require("./handlers/consumer/authConsumer");

let consumer;

async function connectConsumer(kafka) {
  consumer = kafka.consumer({ groupId: "auth-group" });
  await consumer.connect();

  // Subscribe to topics
  await consumer.subscribe({ topic: "user-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (topic === "user-topic") {
        const data = JSON.parse(message.value);

        switch (data.event) {
          case "delete-user":
            await deleteUserInDatabase(data.userId);
            break;
          default:
            console.log(`Unknown event type: ${data.event}`);
        }
      }
    },
  });

  console.log("Consumer connected");
}

async function disconnectConsumer() {
  if (consumer) {
    await consumer.disconnect();
    console.log("Consumer disconnected");
  }
}

module.exports = { connectConsumer, disconnectConsumer };
