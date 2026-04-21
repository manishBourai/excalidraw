import { Router } from "express";
import { signin } from "../controllers/authController";

const router:any= Router();

router.post("/signin",signin)

export default router