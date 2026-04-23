import { prisma } from "@repo/database/db";
import { Request, Response } from "express";

export async function roomCreate(req:Request,res:Response) {
    const room= req.body.room;

    if (!room) {
        return res.status(301).json({
            message:"invalid Room"
        })
    }
    const existingRoom= await prisma.room.findFirst({where:{roomId:room}})
    if (existingRoom) {
         return res.status(301).json({
            message:"Room exist"
        })
    }
    const newRoom = await prisma.room.create({
        data:{
            roomId:room,
            //@ts-ignore
            adminId:req.user.id
        }
    })
    if (!newRoom) {
         return res.status(500).json({
            message:"Something Went wrong"
        })
    }
    return res.status(200).json({
        message:"room created",
        data:newRoom
    })
}