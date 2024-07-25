import dbConfig from "@/configs/dbConfig";
import User from "@/models/User";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server";
export async function POST(req){
    try{
    dbConfig
    const {token,password}=await req.json();
    const user=await User.findOne({forgotPasswordToken:token,forgotPasswordTokenExpiry:{$gt:Date.now()}});
    console.log(user);
    if(!user){
        console.log("hi");
        return NextResponse.json({
            message:"Invalid token",
            status:400,
            success:false
        });
    }
    const hashedPassword=await bcrypt.hash(password,10);
    user.forgotPasswordToken="";
    user.forgotPasswordTokenExpiry=new Date(Date.now());
    user.password=hashedPassword;
    await user.save();
    let newToken=await jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"24h"});
    const response=NextResponse.json({
    success:true,
    status:200,
    user:{
        username:user.username,
        email:user.email,
        avatar:user.avatar
    },
    message:"Login Successfully"
   })
    response.cookies.set("token",newToken,{
    httpOnly:true,
    expires:new Date(Date.now()+24*60*60*1000)
   })
   return response;
    }catch(error){
        console.log(error.message);
        return NextResponse.json({
            success:false,
            status:500,
            message:"Internal server error"
        })
    }
}