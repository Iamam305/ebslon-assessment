import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";

import cors, { CorsOptions } from "cors";

const corsOptions: CorsOptions = {
  origin: [process.env.CORS_ORIGIN!, "*"],
  optionsSuccessStatus: 200,
  credentials: true,
};
import { user_router } from "./routes/user.router";
import { error_handler } from "./middlewares/error.middleware";
import { connect_db } from "./configs/db";
import cookieParser from "cookie-parser";

const app: Express = express();
const port = process.env.PORT || 8000;

app.use(
  express.json({
    inflate: true,
  })
);
app.use(cookieParser());
app.use(cors(corsOptions));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript");
});

app.use("/api/", user_router);

app.use(error_handler);

connect_db(process.env.MONGODB_URI!, {
  dbName: process.env.MONGODB_DB_NAME!,
});
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
