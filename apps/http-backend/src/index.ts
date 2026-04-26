import express, { Request, Response } from "express";
import authRoute from "./routes/authRoute";
import roomRoute from "./routes/roomRoute";
import cookieParser from "cookie-parser";
import rateLimiter from "./util/rateLimite";


const app = express();
const PORT = Number(process.env.PORT) || 3002;

cookieParser()
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(rateLimiter)

app.use("/api/auth", authRoute);
app.use("/api/room", roomRoute);

app.get("/", (_, res: Response) => {
  res.status(200).json({
    message: "ok",
  });
});

 app.listen(PORT, () => {
  console.log(`http-server Running on port ${PORT}`);
});