const {
  deleteReviewsOfProperty,
} = require("./handlers/consumer/reviewConsumer");

let consumer;

async function connectConsumer(kafka) {
  consumer = kafka.consumer({ groupId: "review-group" });
  await consumer.connect();

  // Subscribe to topics
  await consumer.subscribe({ topic: "property-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (topic === "property-topic") {
        const data = JSON.parse(message.value);

        switch (data.event) {
          case "delete-property":
            await deleteReviewsOfProperty(data.propertyId);
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
