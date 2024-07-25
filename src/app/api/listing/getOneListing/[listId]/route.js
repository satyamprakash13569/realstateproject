import Listing from "@/models/Listing";
import { NextResponse } from "next/server";
export async function GET(req){
    try{
    const listId = await req.url.split('/').pop();
    const listing=await Listing.findById(listId);
    return NextResponse.json({
        status:200,
        success:true,
        listing
    })
    }catch(error){
        console.log(error);
    return NextResponse.json({
        success:false,
        status:500,
        message:"IN_SER_ERROR->"+error
    })
    }
}