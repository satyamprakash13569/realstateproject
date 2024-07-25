import { NextResponse } from "next/server";
import User from "@/models/User";
import dbConfig from "@/configs/dbConfig";
export async function POST(req){
    try{
    dbConfig();
    const {secure_url,email}=await req.json();
    await User.findOneAndUpdate({email},{avatar:secure_url});
    return NextResponse.json({
        success:true,
        status:200,
        message:"Secure Url successfully saved into database"
    })
    }catch(error){
        console.log("Error occured while aving url to database.");
        return NextResponse.json({
            success:false,
            status:500,
            message:"Error occured while saving url to database"+error.message
        })
    }
}