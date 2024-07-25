import dbConfig from "@/configs/dbConfig";
import { getDataFromToken } from "@/helper/getDataFromToken";
import User from "@/models/User";
import { NextResponse } from "next/server";
export async function GET(req){
    try{
        dbConfig();
        const userId=await getDataFromToken(req);
        if(userId!=""){
            const user=await User.findOne({_id:userId}).select("-password");
            return NextResponse.json({
                success:true,
                status:200,
                user
            })
        }else{
            return NextResponse.json({
                success:false,
                status:400,
            })
        }
    }catch(error){
       return NextResponse.json({
            status:500,
            success:false,
            message:"IN_SER_ERR! Try Again."+error.message
        })
    }
}