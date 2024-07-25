'use client'
import { AppContext } from "@/context/AppContext"
import { useContext} from "react"
import { useState } from "react"
import Image from "next/image"
import custom1 from '@/app/style/custom1.module.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Avatar(){
    const {email,photoUrl,setPhotoUrl}=useContext(AppContext)
    const [ImageFile,setImageFile]=useState(null);
    const [clickable,setClickable]=useState(true);
    async function uploadImage(){
    if(ImageFile===null){
        toast("Choose an Image for Avatar.");
        return;
    }
    try{
    setClickable(false);
    const formData=new FormData();
    // apend file to formdata
    formData.append("file", ImageFile);
    // bind th upload preset to formdata
    formData.append("upload_preset", "RealEstate");
    // make an api request to cloudinary
    const res= await fetch(
        "https://api.cloudinary.com/v1_1/dc98hldnd/image/upload",
        {
        method: "POST",
        body: formData,
        }
    );
    const data= await res.json();
    const accessUrl=data.secure_url;
    setPhotoUrl(accessUrl);
    setImageFile(null);
    setClickable(true);
    let response=await fetch("/api/users/uploadAvatar",{
        method:"POST",
        headers:{
            'Content-type':"application/json"
        },
        body:JSON.stringify({email:email,secure_url:accessUrl})
    }
    )
    response=await response.json();
    if(response.status===200){
        toast("Avatar successfully uploaded.");
    }
    else{
        toast("Something went wront. Try Again");
    }
    setClickable(true);
      }catch(error){
        console.log("Error Occured While Uploading Avatar to cloudinary.",error.message);
        toast("Error Occured.Try Again.");
      }
    }
    return(
        <div className="max-w-lg p-3 pt-32 mx-auto flex flex-col gap-6">
           <h1 className="text-center p-3 font-bold text-xl">Upload New Avatar</h1>
           <Image src={photoUrl} alt="avatar" height={60} width={60} className="rounded-full w-auto h-auto object-cover self-center"/> 
           <div className="text-right">
           <input 
           type="file"
           onChange={(e)=>setImageFile(e.target.files[0])}
           className={custom1.input}
            />
           </div>
           <button onClick={()=>uploadImage()} className="outline outline-2 p-2 text-white bg-slate-600 rounded-md">{clickable===true?"Upload":"uploading"}</button>
           <ToastContainer/>
        </div>
    )
}