import {Request, NextFunction,Response } from "express";
import jwt from "jsonwebtoken"
import { jwtsecreat } from "./config";
export function middleware(req:Request,res:Response,next:NextFunction){
  const token=req.headers["authorization"] ?? "";

  const decode=jwt.verify(token,jwtsecreat);

  if(decode){
    //@ts-ignore: Todo: fix his??
    req.userId=decode.userId;
    next();
  }
  else{
    res.status(403).json({
        message:"unauthorised"
    }
    )
  }
}