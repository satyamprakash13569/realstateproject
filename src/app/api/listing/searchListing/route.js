import Listing from "@/models/Listing";
import { NextResponse } from "next/server";
import dbConfig from "@/configs/dbConfig";
export async function GET(req){
    try{
    dbConfig();
    const url =await req.url;
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    const city = params.get('city');
    const type = params.get('type');
    // console.log(city);
    // console.log(type);
    let listing;

    if(type==="Both"){
        listing=await Listing.find({"address":city});
    }
    else{
        listing=await Listing.find({"address":city,"type":type});
    }
    return NextResponse.json({
        success:true,
        status:200,
        listing,
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