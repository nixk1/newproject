import express from "express";
import jwt from "jsonwebtoken";
import { jwtsecret } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {CreatUserSchema} from "@repo/common/types"
const app=express();


app.post("/signup",(req,res)=>{

    const data=CreatUserSchema.safeParse(req.body);
    if(!data.success){
        return res.json({
            message:"Incorrect inputs"
        })
    }

})

app.post("/singin",(req,res)=>{
   const userid=1;
   const token=jwt.sign({userid},jwtsecret)
   res.json({
    token
   })
})

app.post("/room",(req,res)=>{

})
app.get("/",middleware,(req,res)=>{
    res.send("hi there");
})
app.listen(3001);