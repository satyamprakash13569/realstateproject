'use client'
import { AppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import {useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function ResetPassword(){
  const {setUserName,setEmail,setPhotoUrl}=useContext(AppContext);
  const router=useRouter()
  const [token,setToken]=useState("");
  const [visible,setVisible]=useState(false);
  const [password,setPassword]=useState({newPassword:"",confirmPassword:""});
  const [loading,setLoading]=useState(false);
  function handleChange(e){
    const {name,value}=e.target;
    setPassword((preState)=>({...preState,[name]:value}));
  }
  async function handleSubmit(){
    if(password.newPassword==="" || password.confirmPassword===""){
      toast("Fill all entries to sign up.");
      return;
    }
    if(password.newPassword!==password.confirmPassword){
      toast("Passwords do not match.Try Again")
      return;
    }
    setLoading(true);
    try{
      const res=await fetch("/api/users/resetPassword",{
      method:"POST",
      headers:{
      'Content-Type':'application/json',
      },
      body:JSON.stringify({password:password.newPassword,token:token})
      });
      const data=await res.json();
      console.log(data);
      setEmail(data.user.email);
      setUserName(data.user.username);
      setPhotoUrl(data.user.avatar)
      toast("New Password saved successfully.");
      router.push("/");
    }catch(error){
      console.log("Error occured while singing up:",error.message);
      toast("Something went wrong.Try Again.");
      }
      setLoading(false);
    }
    useEffect(()=>{
      const splittedUrl=window.location.href.split("/");
      setToken(splittedUrl[splittedUrl.length-1]);
    },[]);
    return (
      <div className="p-3 pt-24 max-w-lg mx-auto">
      <h1 className="text-2xl text-center font-semibold my-5 uppercase">Reset Password</h1>
      <div className="flex flex-col gap-4">
      <input
      name="newPassword"
      type={visible?"text":"password"}
      placeholder="New Password"
      onChange={(e)=>handleChange(e)}
      className="border p-2.5 rounded-lg font-[500] outline outline-1 outline-slate-300"
      />
      <input
      name="confirmPassword"
      type={visible?"text":"password"}
      placeholder="Confirm Password"
      onChange={(e)=>handleChange(e)}
      className="border p-2.5 rounded-lg font-[500] outline outline-1 outline-slate-300"
      />
      <div className="flex justify-between">
      <div className="flex gap-3 items-center">
        <input type="checkbox" onClick={()=>setVisible(!visible)} className="w-4 h-4" />
        <span>show password</span>
      </div>
      </div>
      <button disabled={loading} onClick={()=>handleSubmit()}  className="hover:bg-slate-800 hover:text-white border-2 border-slate-800 bg-white text-slate-800 transition duration-300 ease-in-out  p-2.5 rounded-md font-semibold">{loading?"Loading":"Save"}</button>
      </div>
      <ToastContainer/>
      </div>
    );
}