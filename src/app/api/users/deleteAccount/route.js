import { NextResponse } from "next/server";
import dbConfig from "@/configs/dbConfig";
import User from "@/models/User";
export async function DELETE(req){
    try{
    dbConfig();
    const {email}=await req.json();
    const user=await User.deleteOne({email:email});
    const response=NextResponse.json({
        success:true,
        status:200,
        message:"Account deleted successfully."
    });
    response.cookies.set("token","",{
        httpOnly:true,
        expires:new Date(0)
    });
    return response;
    }catch(error){
    console.log("Error has been occured during deleting account.",error.message);
    return NextResponse.json({
        success:false,
        status:500,
        message:"IN_SER_ERR"+error.message
    })
    }
}