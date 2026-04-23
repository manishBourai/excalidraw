import express, { Response } from "express";
import authRoute from "./routes/authRoute";
import roomRoute from "./routes/roomRoute";
import cookieParser from "cookie-parser";

const app = express();
const PORT = Number(process.env.PORT) || 3002;

cookieParser()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

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

