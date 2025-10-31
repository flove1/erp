import "reflect-metadata";
import { app, logger } from "./server";
import { AppDataSource } from "db/datasource";
import config from "config";

const { PORT } = config.API;

AppDataSource.initialize()
  .then(() => {
    const server = app.listen(PORT);
    logger.info(`server started on port ${PORT}`);

    const onCloseSignal = () => {
      logger.info("sigint received, shutting down");
      server.close(() => {
        logger.info("server closed");
        process.exit();
      });
      setTimeout(() => process.exit(1), 10000).unref();
    };

    process.on("SIGINT", onCloseSignal);
    process.on("SIGTERM", onCloseSignal);
  })
  .catch((err) => {
    if (err instanceof AggregateError) {
      for (const e of err.errors) {
        logger.error(`database connection error: ${JSON.stringify(e)}`);
      }
      process.exit(1);
    }

    logger.error(`database connection error: ${JSON.stringify(err)}`);
    process.exit(1);
  });

