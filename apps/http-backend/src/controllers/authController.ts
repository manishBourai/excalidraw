import { Request, Response } from "express";

interface User{
 username:string,
 email:string,
 password:string
}

let user:User[]=[];


export function signin(req:Request,res:Response) {
    const {username,email,password}=req.body;
    if (!username||!email||!password) {
       return res.status(301).json({
            message:"Invalid Data"
        })
    }
    user.push({username,email,password})
    res.status(200).json({
        message:"User have successfully Created",
        data:user
    })
}