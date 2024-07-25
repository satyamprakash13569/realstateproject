import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import dbConfig from "@/configs/dbConfig";
import { sendEmail } from "@/helper/sendEmail";
export async function POST(request){
    try{
    // connect to database----->
    dbConfig();
    // fetch data from body------>
    const {username,email,password}=await request.json();
    // check if user already registered----->
    const isRegistered=await User.findOne({username});
    if(isRegistered){
        return NextResponse.json({
            success:false,
            status:400,
            message:"User is already registered."
        })
    }
    // hash the password---->
    const hashedPassword=await bcrypt.hash(password,10);
    // create an entry for new user in database--->
    const newUser=await User.create({username,email,password:hashedPassword});
    // send welcome email 
    const res=await sendEmail({email,emailType:"WELCOME",userId:newUser._id});
    // return response
    return NextResponse.json({
        success:true,
        status:201,
        message:"user registered successfylly."
    });
    } catch(error){
        return NextResponse.json({
            success:false,
            status:500,
            message:"Internal server error.Try Again."
        })
    }
}