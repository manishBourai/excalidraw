import express, { Request, Response } from "express";
import authRoute from "./routes/authRoute"

const app= express();

app.get("/",(req:Request,res:Response)=>{
    res.status(200).json({
        message:"ok"
    })
})
app.post("/api/auth",authRoute)

app.listen(3001,()=>{
    console.log("http-server Running");
    
})