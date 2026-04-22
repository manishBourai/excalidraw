import { Server, Socket } from "socket.io";
import {createServer} from "http"
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/jwt-config"

const app=   createServer((req, res) => {
  res.writeHead(200);
  res.end("server is running!");
});

const io= new Server(app)
io.on("connection",(socket:Socket)=>{
  const token=socket.handshake.query.token;
  console.log("a user connected with token",token);
  if (!token) {
    socket.disconnect();
  }
  const decodedToken= jwt.verify(token as string, JWT_SECRET);
  if(!decodedToken || !(decodedToken as JwtPayload).username){
    socket.disconnect();
  }

})

app.listen(8080,()=>{
    console.log("Ws-server is Running");
    
})
