import { NextResponse } from "next/server";
import cloudConfig from "@/configs/cloudConfig";
import { v2 as cloudinary } from 'cloudinary';
import Listing from "@/models/Listing";
export async function POST(req){
    try{
    const {secure_url,listId}=await req.json();
    const public_id=secure_url.split("RealEstate/")[1].split('.')[0];
    cloudConfig();
    const result=await cloudinary.uploader.destroy(`RealEstate/${public_id}`,{
        invalidate:true,
    })
    const listing=await Listing.findById(listId);
    const index=listing.imageUrls.findIndex(url=>url===secure_url);
    listing.imageUrls.splice(index,1);
    await listing.save();
    return NextResponse.json({
        status:200,
        success:true,
        message:"Image deleted successfully."
    });
    }catch(error){
        return NextResponse.json({
            status:500,
            success:false,
            message:"IN_SER_ERR->"+error
        });
    }
}