import {z} from "zod"

export const UserSchema = z.object({
  username: z.string().min(2).max(30),
  email: z.string().email(),
  password: z.string().min(6).max(100)
});

export const signupSchema= z.object({
    username: z.string().min(2).max(30),
    email: z.string().email(),
    password: z.string().min(6).max(100)
})

export const signinSchema= z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100)
})

export const roomSchema= z.object({
    roomId: z.string().min(1),
    isPrivate: z.boolean().default(false),
})
