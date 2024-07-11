const express = require("express");
const cors = require("cors");
const { PORT } = require("./config/index.js");
const userRouter = require("./routes/userRouter");
const { startKafka, stopKafka } = require("./kafka/index.js");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors());
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", userRouter);

let server;

async function startServer() {
  try {
    server = app.listen(PORT, () => {
      console.log(`Running on port ${PORT}`);
    });

    await startKafka();
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

async function gracefulShutdown() {
  console.log("Graceful shutdown initiated");

  await stopKafka();

  if (server) {
    server.close(async (err) => {
      if (err) {
        console.error("Error closing HTTP server:", err);
        process.exit(1);
      }
      console.log("HTTP server closed");
      process.exit(0);
    });
  }
}

const signals = ["SIGINT", "SIGTERM", "SIGQUIT"];
signals.forEach((signal) => {
  process.on(signal, () => {
    console.log(`Received ${signal}, starting graceful shutdown...`);
    gracefulShutdown();
  });
});

startServer();
