import express from "express";
import jwt from "jsonwebtoken";
import { jwtsecret } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {CreatUserSchema, SigninSchema, CreatRoomSchema} from "@repo/common/types"
import {prismaClient} from "@repo/db/client"
import { email } from "zod";
const app=express();


app.post("/signup",async (req,res)=>{

    const parsedata=CreatUserSchema.safeParse(req.body);
    if(!parsedata.success){
        return res.json({
            message:"Incorrect inputs"
        })
    }

    try {
       const user =  await prismaClient.user.create({
            data : {
                    email: parsedata.data.username,
                    name : parsedata.data.name,
                    password: parsedata.data.password
                   }
        })
        res.json(
            {
                "userid": user._id,
            }
            
        )

    } catch (error) {
        res.json({msg:"inavalid signup"})
    }

})

app.post("/singin", async (req, res) => {
    const parsedata = SigninSchema.safeParse(req.body);
    if (!parsedata.success) {
        return res.json({
            msg: "signin Schema doesn't matched"
        });
    }
    const user = await prismaClient.user.findFirst({
        where: {
            email: parsedata.data.username,
            password: parsedata.data.password
        }
    });
    if (!user) {
        return res.json({
            msg: "invalide signin"
        });
    }

    const userid = user?.id;
    const token = jwt.sign({ userid }, jwtsecret);
    res.json({
        token
    });
});

app.post("/room",middleware, async (req,res)=>{
const parsedata = CreatRoomSchema.safeParse(req.body);
    if (!parsedata.success) {
        return res.json({
            msg: "room Schema doesn't matched"
        });
    }

    const userid = req.userId;

    try {
        const room = await prismaClient.room.create({
        data:{
            slug: parsedata.data.name,
            adminId: userid
        }
    })
    res.json(
        {roomid: room?.id}
    )
    } catch (error) {
        res.json({
            msg:"err occured in room route"
        })
    }
})
app.get("/",middleware,(req,res)=>{
    res.send("hi there");
})
app.listen(3001);