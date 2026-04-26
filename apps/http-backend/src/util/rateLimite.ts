import { NextFunction, Request, Response } from "express";
import {Redis} from "ioredis";


const redis = new Redis();
export default async function rateLimiter(req: Request, res: Response, next: NextFunction) {
    
   try {
     const ip=req.ip;
     
     if (!ip) {
         return res.status(400).json({ message: "Unable to identify client" });
     }
     const current = await redis.incr(ip);
     if (current === 1) {
         await redis.expire(ip, 60); // Set expiration time to 60 seconds
     }
     if (current > 10) {
         return res.status(429).json({ message: "Too many requests" });
     }
     next();
   } catch (error) {
     return res.status(500).json({ message: "Internal server error" });
   }
}