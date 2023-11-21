import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import v1Router from "./routes/APIv1";
import publicRouter from "./routes/Public";
import transcationIdMiddleware from "./middleware/TransactionId";
import morganMiddleware from "./middleware/Morgan";
import morgan from "morgan";
import logger from "./utils/Logger";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
var app = express();
app.use(transcationIdMiddleware);

// Morgan log to file via Winston
app.use(morganMiddleware);

// Morgan log to stdout 'dev' profile gives colouring to status codes and second middleware adds trace and date
app.use(morgan("dev"));
app.use(morgan(":transaction_id [:date[clf]]"));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/v1", v1Router);
app.use("/loggable", publicRouter);


// Catch-all handler
app.use((err, req, res, next) => {
  if (!err) {
    return next();
  }
  res.status(500);
  res.send("500: Internal server error");
  logger.error(
    `Internal server error. transaction-id: ${req.transactionId} error: ${err.message}`
  );
});
export default app;
