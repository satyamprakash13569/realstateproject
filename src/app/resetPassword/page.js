'use client'
import Link from "next/link";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BiArrowBack } from "react-icons/bi";  
import { CgCheckO } from "react-icons/cg";
import { useRouter } from "next/navigation";
export default function ResetPassword(){
  const [loading,setLoading]=useState(false);
  const [email,setEmail]=useState("");
  const [isSent,setIsSent]=useState(false);
  async function handleSubmit(){
    try{
      setLoading(true);
      if(email===""){
          toast("Please Enter Your Email.");
          setLoading(false)
          return;
        }
      const res=await fetch("/api/users/resetPasswordEmail",{
        method:"POST",
        headers:{
        'Content-Type':'application/json',
        },
        body:JSON.stringify({email})
      })
      setIsSent(true);
      toast("Please have a look to your email box to reset password.")
    }catch(error){
      toast("Error occured! Try Again.");
      console("Error occured while sending Password Reset Email.",error.message)
    }
    setLoading(false);
    }
    return (
      <div className="p-3 pt-24 max-w-sm mx-auto mt-[5%]">
      {
      isSent===false? (<div className="flex flex-col gap-4">
      <h1 className="text-xl font-[700]  uppercase">Reset Password</h1>
      <p className="text-slate-700 w-80 text-sm font-bold ">Enter your email address and we will send you email to reset your password.</p>
      <input
      id="email"
      type="email"
      placeholder="Enter Email"
      required
      onChange={(e)=>setEmail(e.target.value)}
      className="border border-slate-800 rounded-md p-2.5 font-semibold"
      />
      <button disabled={loading} onClick={()=>handleSubmit()} className="hover:bg-slate-800 bg-white border border-slate-800 text-slate-800 hover:text-white py-2.5  rounded-md font-semibold  transition duration-300 ease-in-out">{loading?"Loading":"Continue"}</button>
      <Link href={"/login"} className="text-blue-500 font-semibold ">
        <div className="flex items-center gap-2">
        <span className="text-green-400">
        <BiArrowBack fontSize={25}/>
        </span>
        <p className="text-slate-500 font-semibold">Back to Login Page.</p>
        </div>
      </Link>
       </div>):(<div className="flex items-center gap-2 w-full">
        <span className="text-green-400">
        <CgCheckO fontSize={25}/>
        </span>
        <p className="text-slate-700 font-semibold">Reset password email has been sent.</p>
        </div>)
      }
      <ToastContainer/>
      </div>
    );
}