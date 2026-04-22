import express from "express";
import { signin, signup } from "../controllers/authController.js";

const router:any= express.Router();

router.post("/signin",signin)
router.post("/signup",signup)

export default router