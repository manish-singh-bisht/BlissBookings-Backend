let consumer;

async function connectConsumer(kafka) {
  consumer = kafka.consumer({ groupId: "user-group" });
  await consumer.connect();

  // Subscribe to topics and run handlers
  // await consumer.subscribe({ topic: "auth-topic", fromBeginning: true });

  // await consumer.run({
  //   eachMessage: async ({ topic, partition, message }) => {
  //     if (topic === "auth-topic") {
  //       const data = JSON.parse(message.value);

  //       switch (data.event) {
  //         case "register-user":
  //           await createUserInDatabase(data.user);
  //           break;
  //         default:
  //           console.log(`Unknown event type: ${data.event}`);
  //       }
  //     }
  //   },
  // });

  console.log("Consumer connected");
}

async function disconnectConsumer() {
  if (consumer) {
    await consumer.disconnect();
    console.log("Consumer disconnected");
  }
}

module.exports = { connectConsumer, disconnectConsumer };
