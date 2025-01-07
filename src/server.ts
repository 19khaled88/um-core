import { PrismaClient } from "@prisma/client";
import app from "./app";
import config from "./config";
import { successLogger, errorLogger } from "./shared/logger/logger";
import { Server } from "http";
import { RedisClient } from "./shared/redis";
import subscribeToEvents from "./app/events";

process.on("uncaughtException", (err) => {
  errorLogger.error(err);
  process.exit(1);
});

let server: Server;
const prisma = new PrismaClient();

async function dbConn() {
  try {
    await RedisClient.connect().then(()=>{
      subscribeToEvents();
    });
    await prisma.$connect();
    successLogger.info("Postgresql database connected successfully");

    server = app.listen(config.port, () => {
      successLogger.info(`connection established on ${config.port}`);
    });
  } catch (error) {
    errorLogger.error("Database connection failed");
  }

  process.on("unhandledRejection", (err) => {
    if (server) {
      server.close(() => {
        errorLogger.error(err);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

dbConn();

process.on("SIGTERM", () => {
  successLogger.info("SIGTERM is received");
  if (server) {
    server.close(async () => {
      await prisma.$disconnect();
    });
  }
});
