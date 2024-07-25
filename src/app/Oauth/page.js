'use client'
import { FcGoogle } from "react-icons/fc";
import {GoogleAuthProvider,getAuth,signInWithPopup} from '@firebase/auth'
import { SatyamEstate } from "@/firebase";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
export default function Oauth(){
    const {setUserName,setEmail,setPhotoUrl,setIsVerified,setUserId}=useContext(AppContext);
    const router=useRouter();
    async function handleGoogleClick(){
    try{
    const provider=new GoogleAuthProvider();
    const auth=getAuth(SatyamEstate);
    const result=await signInWithPopup(auth,provider);
    const res=await fetch("/api/users/google",{
        method:"POST",
        headers:{
            'Content-Type':"application/json",
        },
        body:JSON.stringify({username:result.user.displayName,email:result.user.email,photo:result.user.photoURL})
    });
    const data=await res.json();
    setUserName(data.rest.username);
    setEmail(data.rest.email);
    setPhotoUrl(data.rest.avatar);
    setIsVerified(true);
    setUserId(data.rest._id);
    router.push("/")
    }catch(error){
        console.log("Error Occured while Google Authentication.",error.message);
        alert("Try Again.");
    }
}
    return(
        <div>
            <button type="button" onClick={()=>handleGoogleClick()} className="w-full hover:outline hover:outline-3 hover:outline-pink-300 rounded-md hover:rounded-full border-2 border-slate-600  flex justify-center items-center gap-4 p-2">
            <FcGoogle  fontSize={20} />
            <span>Continue with Google</span>
            </button>
        </div>
    )
}