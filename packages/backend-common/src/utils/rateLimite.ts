import {Redis} from "ioredis";


const redis = new Redis("redis://redis:6379");
export default async function rateLimiter(req: any, res: any, next: any) {
    
   try {
     const ip=req.ip;
     const current = await redis.incr(ip);
     if (current === 1) {
         await redis.expire(ip, 60); // Set expiration time to 60 seconds
     }
     if (current > 100) {
         return res.status(429).json({ message: "Too many requests" });
     }
     next();
   } catch (error) {
     return res.status(500).json({ message: "Internal server error" });
   }
}