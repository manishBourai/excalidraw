import { Router } from "express";
import isLogin from "../middleware/isLogin"
import { deleteRoom, getCanvasSnapshot, getMyRooms, roomCreate, saveCanvasSnapshot } from "../controllers/roomController";

const router:any=Router();

router.post("/",isLogin,roomCreate)
router.get("/my",isLogin,getMyRooms)
router.get("/:roomId/canvas",isLogin,getCanvasSnapshot)
router.put("/:roomId/canvas",isLogin,saveCanvasSnapshot)
router.delete("/:roomId",isLogin,deleteRoom)

export default router
