import { NextResponse } from "next/server";
import User from "@/models/User";
import dbConfig from "@/configs/dbConfig";
import bcrypt from "bcrypt"
export async function POST(req){
    try{
    dbConfig();
    const {email,password,}=await req.json();
    const user=await User.findOne({email});
    const hashedPassword=await bcrypt.hash(password,10);
    user.password=hashedPassword;
    user.save();
    return NextResponse.json({
        success:true,
        status:200,
        message:"New Password has been saved."
    });
    }catch(error){
        console.log("Error occured while saving password",error.message);
        return NextResponse.json({
            success:false,
            status:500,
            message:"Error occured saving password."+error.message
        })
    }
}