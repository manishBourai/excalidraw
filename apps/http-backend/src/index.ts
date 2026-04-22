import express, { Response } from "express";
import authRoute from "./routes/authRoute.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);

app.get("/", (_, res: Response) => {
  res.status(200).json({
    message: "ok",
  });
});

const server = app.listen(PORT, () => {
  console.log(`http-server Running on port ${PORT}`);
});

server.on("error", (error) => {
  console.error("http-server failed to start", error);
  process.exit(1);
});
