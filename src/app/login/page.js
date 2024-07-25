'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import {useContext, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Oauth from "../Oauth/page";
import { AppContext } from "@/context/AppContext";
export default function Login() {
  const {setUserName,setEmail,setPhotoUrl, setIsVerified,setUserId}=useContext(AppContext);
  const router=useRouter()
  const [visible,setVisible]=useState(false);
  const [formdata,setFormdata]=useState({email:"",password:""});
  const [loading,setLoading]=useState(false);
  const [userFound,setUserFound]=useState(true);
  const [credentials,setCredentials]=useState(true);
  function handleChange(e){
    const {name,value}=e.target;
    setFormdata((preState)=>({...preState,[name]:value}));
  }
  async function handleSubmit(){
    if(formdata.email==="" || formdata.password===""){
    toast("Fill all entries to  Login.");  
    return;
    }
    setLoading(true);
    try{
      const res=await fetch("/api/users/login",{
      method:"POST",
      headers:{
      'Content-Type':'application/json',
      },
      body:JSON.stringify(formdata)
      });
      const data=await res.json();
      if(data.status===401){
      setCredentials(false);
      setUserFound(true)
      toast("You entered wrong credentials");
      }
      else if(data.status===404){
      setUserFound(false);
      setCredentials(true);
      toast("User Not Found")
      }
      else if(data.status===500){
        toast("IN_SER_ERROR! Try Again.")
      }
      else{
      toast("Logged in successfully.");
      setEmail(data.user.email);
      setUserName(data.user.username);
      setPhotoUrl(data.user.avatar);
      setIsVerified(false);
      setUserId(data.user._id);
      router.push("/");
      }
      setLoading(false);
    }catch(error){
        console.log("Error occured while singing up:",error.message);
        toast("Something went wrong.Try Again.");
      }
      setLoading(false);
    }
    return (
      <div className="p-3 max-w-lg mx-auto mt-24 ">
      <h1 className="text-2xl text-center font-[700] my-5 uppercase">Login</h1>
      <div className="flex flex-col gap-4">
      <input
      name="email"
      id="email"
      type="email"
      placeholder="Email"
      onChange={(e)=>handleChange(e)}
      className="border p-2.5 rounded-lg font-[500] outline outline-1 outline-slate-300"
      />
      <input
      name="password"
      id="password"
      type={visible?"text":"password"}
      placeholder="Password"
      onChange={(e)=>handleChange(e)}
      className="border p-2.5 rounded-lg font-[500] outline outline-1 outline-slate-300"
      />
      <div className="flex justify-between">
      <div className="flex gap-3 items-center">
        <input type="checkbox" onClick={()=>setVisible(!visible)} className="w-4 h-4" />
        <span>show password</span>
      </div>
      <Link href={"/resetPassword"} className="text-green-600 text-sm font-semibold">Forgot Password?</Link>
      </div>
      <button disabled={loading} onClick={()=>handleSubmit()}  className="bg-slate-800 text-white p-2.5 rounded-lg font-semibold hover:opacity-95 disabled:opacity-80">{loading?"Loading":"Login"}</button>
      <Oauth authType="Login"/>
      </div>
      <div className="flex justify-between items-baseline mt-3 ">
      <div className="flex justify-center items-baseline gap-2">
      <p>Do not have an account?</p>
      <Link href={"/signup"} className="text-blue-500 font-semibold ">Sign Up</Link>
      </div>
      {
        userFound===false && <div className="text-red-500 font-bold text-sm ">User Not Found</div>
      }
      {
        !credentials && <div className="text-red-500 font-bold text-sm ">Invalid credentials</div>
      }
      </div>
      <ToastContainer/>
      </div>
    );
}