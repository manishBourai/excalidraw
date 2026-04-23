import { Router } from "express";
import isLogin from "../middleware/isLogin"
import { roomCreate } from "../controllers/roomController";

const router:any=Router();

router.post("/",isLogin,roomCreate)

export default router