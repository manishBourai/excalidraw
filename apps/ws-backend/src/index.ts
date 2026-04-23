import { Server, Socket } from "socket.io";
import { createServer } from "http";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/jwt-config";

const app = createServer((req, res) => {
  res.writeHead(200);
  res.end("server is running!");
});

interface User {
  user: string;
  room?: string;
  socket: Socket;
}

let users: User[] = [];
let AllUsers:[]=[]

const io = new Server(app);
io.on("connection", (socket: Socket) => {
  const { token,name } = socket.handshake.query;
  console.log("a user connected with token", token);
  if (!token) {
    socket.disconnect();
  }
  const decodedToken = jwt.verify(token as string, JWT_SECRET);
  if (!decodedToken || !(decodedToken as JwtPayload).username) {
    socket.disconnect();
  }

  users.push({
    //@ts-ignore
    user: decodedToken.data.id,
    socket,
  });
  if (!name) {
    return
  }
  //@ts-ignore
  AllUsers.push(name)
  socket.on("joinRoom", async (roomId: string,cb:CallableFunction) => {
    if (!roomId) {
      return;
    }
    const user = users.find((x) => x.socket == socket);
    //@ts-ignore
    user.room = roomId;
    socket.join(roomId)
    cb({message:`${roomId} room joined`})
  });
  socket.on("chat", (data: string,roomId:string) => {
    io.to(roomId).emit("chat",data)
  });
  socket.on("leave",(roomId:string,cb:CallableFunction)=>{
    socket.leave(roomId);
    cb({message:`${roomId} room left`})
  })
  socket.on("disconnect",()=>{
    users=users.filter(x=>x.socket==socket)
    // AllUsers=AllUsers.filter(x=>x.socket==socket)
    
  })
});

app.listen(8080, () => {
  console.log("Ws-server is Running");
});
