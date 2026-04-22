import { prisma } from "@repo/database/db"
import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

async function isLogin(req:Request,res:Response , next:NextFunction) {
     try {
     const token = req.cookies.token

     if(!token){
     
    return  res.status(401).clearCookie("token").json({message:"not login"})
      // throw new apiError(401,"not login")
     }
     
   const refreshToken= jwt.verify(token,"token")
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