import { Server, Socket } from "socket.io";
import {createServer} from "http"
const app=   createServer((req, res) => {
  res.writeHead(200);
  res.end("server is running!");
});

const io= new Server(app)
io.on("connection",(socket:Socket)=>{

})

app.listen(8080,()=>{
    console.log("Ws-server is Running");
    
})
