import { NextResponse } from "next/server";
import Listing from "@/models/Listing";
import dbConfig from "@/configs/dbConfig";
export async function POST(req){
    try{
    dbConfig();
    const data=await req.json();
    const listing=await Listing.create(data);
    return NextResponse.json({
        status:200,
        success:true,
        message:"Listing created successfully.",
        listing

    })
    }catch(error){
        return NextResponse.json({
            status:500,
            success:false,
            message:"Internal server Error"+error.message
        })
    }
}