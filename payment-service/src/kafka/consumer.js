const {
  createPaymentRecordInitialization,
  cancelPayment,
} = require("./handlers/consumer/paymentConsumer");

let consumer;

async function connectConsumer(kafka) {
  consumer = kafka.consumer({ groupId: "payment-group" });
  await consumer.connect();

  // Subscribe to topics and run handlers
  await consumer.subscribe({ topic: "booking-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (topic === "booking-topic") {
        const data = JSON.parse(message.value);

        switch (data.event) {
          case "booking-initiated":
            await createPaymentRecordInitialization(data.booking);
            break;
          case "booking-cancelled-due-to-ttl":
            await cancelPayment(data.booking);
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
