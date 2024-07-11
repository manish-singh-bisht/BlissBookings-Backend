const {
  changeBookingStatusToConfirmed,
  changeBookingStatusToCancelled,
} = require("./handlers/consumers/bookingConsumer");

let consumer;

async function connectConsumer(kafka) {
  consumer = kafka.consumer({ groupId: "booking-group" });
  await consumer.connect();

  // Subscribe to topics and run handlers
  await consumer.subscribe({ topic: "payment-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (topic === "payment-topic") {
        const data = JSON.parse(message.value);

        switch (data.event) {
          case "payment-success":
            await changeBookingStatusToConfirmed(data.payment);
            break;
          case "payment-failure":
            await changeBookingStatusToCancelled(data.payment);
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
