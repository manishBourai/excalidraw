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

export async function getMyRooms(req:Request,res:Response) {
    //@ts-ignore
    const userId = req.user.id;

    const rooms = await prisma.room.findMany({
        where: {
            OR: [
                { adminId: userId },
                { messages: { some: { senderId: userId } } }
            ]
        },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            roomId: true,
            adminId: true,
            createdAt: true,
            _count: {
                select: { messages: true }
            }
        }
    });

    return res.status(200).json({
        message: "rooms loaded",
        data: rooms
    });
}

export async function saveCanvasSnapshot(req:Request,res:Response) {
    const roomId = String(req.params.roomId ?? "");
    const { snapshot } = req.body;

    if (!roomId || !snapshot) {
        return res.status(400).json({ message: "invalid canvas payload" });
    }

    const room = await prisma.room.findFirst({ where: { roomId } });
    if (!room) {
        return res.status(404).json({ message: "room not found" });
    }

    await prisma.chatHistory.create({
        data: {
            //@ts-ignore
            senderId: req.user.id,
            roomId: room.id,
            message: JSON.stringify({ type: "canvas:snapshot", snapshot })
        }
    });

    return res.status(200).json({
        message: "canvas saved",
        data: snapshot
    });
}

export async function getCanvasSnapshot(req:Request,res:Response) {
    const roomId = String(req.params.roomId ?? "");

    if (!roomId) {
        return res.status(400).json({ message: "invalid room" });
    }

    const room = await prisma.room.findFirst({ where: { roomId } });
    if (!room) {
        return res.status(404).json({ message: "room not found" });
    }

    const latestCanvasMessage = await prisma.chatHistory.findFirst({
        where: { roomId: room.id },
        orderBy: { createdAt: "desc" }
    });

    if (!latestCanvasMessage) {
        return res.status(200).json({
            message: "canvas loaded",
            data: null
        });
    }

    const parsedMessage = JSON.parse(latestCanvasMessage.message);

    return res.status(200).json({
        message: "canvas loaded",
        data: parsedMessage.snapshot ?? null
    });
}
export async function deleteRoom(req:Request,res:Response) {
    const roomId = String(req.params.roomId ?? "");

    if (!roomId) {
        return res.status(400).json({ message: "invalid room" });
    }

    const room = await prisma.room.findFirst({ where: { roomId } });
    if (!room) {
        return res.status(404).json({ message: "room not found" });
    }
    //@ts-ignore
    if (room.adminId !== req.user.id) {
        return res.status(403).json({ message: "you are not admin of this room" });
    }

    await prisma.room.delete({ where: { id: room.id } });
    
    return res.status(200).json({
        message: "room deleted"
    });
}
