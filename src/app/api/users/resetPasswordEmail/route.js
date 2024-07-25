import dbConfig from "@/configs/dbConfig";
import { sendEmail } from "@/helper/sendEmail";
import User from "@/models/User";
import { NextResponse } from "next/server";
export async function POST(req){
    try{
    dbConfig();
    const {email}=await req.json();
    const user=await User.findOne({email});
    if(!user){
        return NextResponse.json({
            status:404,
            success:false,
            message:"USER NOT FOUND."
        });
    }
    const res=await sendEmail({email:email,emailType:"RESET",userId:user._id});
    return NextResponse.json({
    success:true,
    status:200,
    message:"Email for RESET PASSWORD  has been sent successfully."
    })
    }catch(error){
        return NextResponse.json({
            success:false,
            status:500,
            message:"Error:->"+error.message
        })
    }
}