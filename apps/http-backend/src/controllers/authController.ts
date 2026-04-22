import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/jwt-config";
import { prisma } from "@repo/database/db";
import { signinSchema, signupSchema } from "@repo/common/zod-schemas";
import bcrypt from "bcrypt";


export async function signin(req: Request, res: Response) {
  const { email, password } = req.body;
  const data = signinSchema.safeParse({ email, password });
  if (!data.success) {
    return res.status(400).json({
      message: "Invalid Data",
    });
  }

  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid password",
    });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
  res.cookie("Token", token).status(200).json({
    message: "Signin successful",
    data: user,
    token,
  });
}

export async function signup(req: Request, res: Response) {
  const { username, email, password } = req.body;
  const data = signupSchema.safeParse({ username, email, password });
  if (!data.success) {
    return res.status(400).json({
      message: "Invalid Data",
    });
  }

//   const existingUser = await prisma.user.findFirst({ where: { email } });
//   if (existingUser) {
//     return res.status(400).json({
//       message: "User already exists",
//     });
//   }

  const hashPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashPassword, username },
  });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
  res.cookie("Token", token).status(200).json({
    message: "User created successfully",
    data: user,
    token,
  });
}
