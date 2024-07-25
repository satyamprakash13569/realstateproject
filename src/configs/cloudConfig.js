import { v2 as cloudinary } from 'cloudinary';
export default async function cloudConfig(){
    try{
        cloudinary.config({
            cloud_name:process.env.CLOUD_NAME,
            api_key:process.env.API_KEY,
            api_secret:process.env.API_SECRET
        })
        console.log("Cloudinary connected successfylly.");
    }catch(error){
     console.log("Error while making connection with cloudinary.",error.message);
     process.exit(1);
    }
}