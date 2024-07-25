import dbConfig from "@/configs/dbConfig";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
export async function POST(request){
    try{
        dbConfig();
        // fetch data from request body---->
        const {email,password}=await request.json();
        const RegisteredUser=await User.findOne({email});
        if(!RegisteredUser){
         return  NextResponse.json({
                status:404,
                success:false,
                message:"User is not registered."
            })
        }
        // check for correct password--->
        const isSame=await bcrypt.compare(password,RegisteredUser.password);
        if(!isSame){
          return  NextResponse.json({
                status:401,
                success:false,
                message:"Wrong password."
            })
        }
        else{
            // creating token
            const user=RegisteredUser;
            user.password=undefined;
            let token=await jwt.sign({id:RegisteredUser._id},process.env.JWT_SECRET,{expiresIn:"24h"});
            const response=NextResponse.json({
                status:200,
                success:true,
                message:"User Logged in successfully.",
                user
            })
            //  setting an httpOnly cookie named token with expiration 24 hours
            response.cookies.set("token",token,{
                httpOnly:true,
                expires:new Date(Date.now()+24*60*60*1000)
            });
            return response;
        }
    }catch(error){
       return NextResponse.json({
            status:500,
            success:false,
            message:"Internal Server Error.Try Again"
        })
    }
}