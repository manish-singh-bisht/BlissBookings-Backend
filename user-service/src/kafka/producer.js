const { CompressionTypes } = require("kafkajs");

let producer;

async function connectProducer(kafka) {
  producer = kafka.producer();
  await producer.connect();
  console.log("Producer connected");
}

async function disconnectProducer() {
  if (producer) {
    await producer.disconnect();
    console.log("Producer disconnected");
  }
}
async function sendMessage(topic, message) {
  try {
    await producer.send({
      topic,
      compression: CompressionTypes.GZIP,
      messages: [{ value: JSON.stringify(message) }],
    });
  } catch (error) {
    console.error("Failed to send message:", error);
  }
}

module.exports = { connectProducer, disconnectProducer, sendMessage };
