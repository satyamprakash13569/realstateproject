import Listing from "@/models/Listing";
import { NextResponse } from "next/server";
export async function DELETE(req){
    try{
        const listId = req.url.split('/').pop();
        await Listing.findByIdAndDelete({_id:listId});
        return NextResponse.json({
            status:200,
            success:true,
            message:"Listing deleted successfully."
        })
    }catch(error){
        return NextResponse.json({
            success:false,
            status:500,
            message:"IN_SER_ERROR->"+error
        })
    }
}