import {z} from "zod";


export const CreatUserSchema = z.object({
    username: z.string().min(3).max(20),
    password:z.string(),
    name:z.string()
})

