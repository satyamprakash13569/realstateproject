'use client'
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContext } from "@/context/AppContext";
import { CgCheckO } from "react-icons/cg";
import { BiArrowBack } from "react-icons/bi";
export default function VerifyEmail() {
  const {setEmail,setIsVerified}=useContext(AppContext);
  useEffect(()=>{
    toast("Email Verified successfully.");
    setIsVerified(true);
    const email=window.location.search.split("=")[1];
    setEmail(email);
  },[])
    return (
      <div className="flex flex-col items-center gap-4 mt-40 ">
      <div className="flex items-center gap-2">
          <p className="text-slate-600 font-semibold">Your Email is Verified Successfully.</p>
          <span className="text-green-400">
          <CgCheckO fontSize={25}/>
          </span>
        </div>
      <Link href={"/signup"}>
         <div className="flex items-center gap-2">
          <span className="text-green-400">
          <BiArrowBack fontSize={25}/>
          </span>
          <p className="text-slate-600 font-semibold">Back to Sign up Page.</p>
        </div>
      </Link>
      <ToastContainer/>
      </div>
    );
}