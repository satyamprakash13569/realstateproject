import Listing from "@/models/Listing";
import { NextResponse } from "next/server";
export async function POST(req){
    try{
        const listId=req.url.split('/').pop();
        const data=await req.json();
        const updatedListing = await Listing.findByIdAndUpdate(listId, data, { new: true });
        return NextResponse.json({
            success:true,
            status:200,
            updatedListing,
            message:"List information updated."
        })
    }catch(error){
        return NextResponse.json({
            success:false,
            status:500,
            message:"IN_SER_ERROR->"+error
        });
    }
}