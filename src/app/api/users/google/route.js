import User from "@/models/User";
import { NextResponse } from "next/server";
import dbConfig from "@/configs/dbConfig";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
export async function POST(req){
    try{
        dbConfig();
        const{username,email,photo}=await req.json();
        const user=await User.findOne({email:email});
        if(user){
        const token=await jwt.sign({id:user._id},
            process.env.JWT_SECRET,
            {
                expiresIn:"1h"
            }
            );
        const {password:pass,...rest}=user._doc;
        const response=NextResponse.json({
            success:true,
            status:200,
            message:"successfully Logged in.",
            rest
        })
        response.cookies.set("token",token,{
            httpOnly:true,
            expires:new Date(Date.now()+24*60*60*1000)
        })
        return response;
        }else{
            const generatedPassword=Math.random.toString(36).slice(-8)+Math.random(36).toString(36).slice(-8);
            const hashedPassword=await bcrypt.hash(generatedPassword,10);
            const newUser=await User.create(
            {
                username:username.split(" ").join("").toLowerCase()+ Math.random(36).toString().slice(-4),
                email:email,password:hashedPassword,
                avatar:photo,
                isVerified:true
            }
            );
            const token=await jwt.sign({id:newUser._id},process.env.JWT_SECRET,{expiresIn:"1h"});
            const {password:pass,...rest}=newUser._doc;
            const response=NextResponse.json({
                status:200,
                success:true,
                message:"successfully Logged in.",
                rest
            });
            response.cookies.set("token",token,{
                httpOnly:true,
                expires:new Date(Date.now()+24*60*60*1000)
            });
            return response; 
        }
    }catch(error){
        console.log("error occured:->",error);
        return NextResponse.json({
            status:500,
            success:false,
            message:"Internal Server Error."
        })
    }
}