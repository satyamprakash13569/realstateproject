import { NextResponse } from "next/server";
export function GET(){
    try{
    const response=NextResponse.json({
        success:true,
        status:200,
        message:"Logout successfully."
    });
    response.cookies.set("token","",{
        httpOnly:true,
        expires:new Date(0)
    });
    return response;
    }catch(error){
    console.log("Error has been occured during logout.",error.message);
    return NextResponse.json({
        success:false,
        status:500,
        message:"IN_SER_ERR"+error.message
    })
    }
}