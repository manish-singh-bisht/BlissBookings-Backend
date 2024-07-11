const { connectProducer, disconnectProducer } = require("./producer");
const { connectConsumer, disconnectConsumer } = require("./consumer");
const { Kafka } = require("kafkajs");
const { KAFKA_BROKERS, CLIENT_ID } = require("../config");

const kafka = new Kafka({
  clientId: CLIENT_ID,
  brokers: KAFKA_BROKERS,
  // clientId: "booking-client",
  // brokers: ["localhost:9092"],
});

async function startKafka() {
  await connectProducer(kafka);
  await connectConsumer(kafka);
  console.log("Kafka started");
}

async function stopKafka() {
  await disconnectProducer();
  await disconnectConsumer();
  console.log("Kafka stopped");
}

module.exports = { startKafka, stopKafka };
