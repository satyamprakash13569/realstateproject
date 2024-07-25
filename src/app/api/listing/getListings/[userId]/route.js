import Listing from "@/models/Listing";
import { NextResponse } from "next/server";
export async function GET(req){
    try{
    const userId = req.url.split('/').pop();
    const listings=await Listing.find({userRef:userId});
    return NextResponse.json({
        status:200,
        success:true,
        listings
    })
    }catch(error){
    return NextResponse.json({
        success:false,
        status:500,
        message:"IN_SER_ERROR->"+error
    })
    }
}