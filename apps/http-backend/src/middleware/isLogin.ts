import { JWT_SECRET } from "@repo/backend-common/jwt-config"
import { prisma } from "@repo/database/db"
import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

async function isLogin(req:Request,res:Response , next:NextFunction) {
     try {
     const {Token} = req.cookies
     const bearerToken = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice("Bearer ".length)
      : undefined;
// console.log("token: ",req.cookies);

     if(!Token && !bearerToken){
     
    return  res.status(401).clearCookie("token").json({message:"not login"})
      // throw new apiError(401,"not login")
     }
     
   const refreshToken= jwt.verify(Token ?? bearerToken,JWT_SECRET)
   if (!refreshToken|| typeof(refreshToken)=="string" ) {
    return res.status(401).clearCookie("token").json({message:"token not vailde"})
   }
 
     const user= await prisma.user.findUnique({
        where:{
            id:refreshToken.id
        }
     })
 
     if (!user) {
     return res.status(401).clearCookie("token").json({message:"token not vailde"})
        // throw new apiError(404,"token invalid")
     }
     //@ts-ignore
      req.user=refreshToken;
 
     next()
   } catch (error:any) {
    res.status(401).clearCookie("token").json({message:error.message})
   // throw new apiError(401,error.message)
   }
}
export default isLogin
