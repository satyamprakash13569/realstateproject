'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Oauth from "../Oauth/page";
import { AppContext } from "@/context/AppContext";
import { CgCheckO } from "react-icons/cg";
export default function SignUp() {
  const {email,isVerified}=useContext(AppContext);
  const router=useRouter()
  const [visible,setVisible]=useState(false);
  const [isClicked,setIsClicked]=useState(false);
  const [formdata,setFormdata]=useState({username:"",email:"",password:""});
  const [loading,setLoading]=useState(false);
  function handleChange(e){
    const {name,value}=e.target;
    setFormdata((preState)=>({...preState,[name]:value}));
  }
  async function handleSendEmail(){
    try{
    setLoading(true);
    const res=await fetch("/api/users/verifyEmail",{
      method:"POST",
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify(formdata.email)
    })
    const data=await res.json();
    setIsClicked(true);
    }catch(error){
      toast("Error occured while verifying email.");
      console.log("Error occured while verifying email->",error.message)
    }
    setLoading(false);
  }
  async function handleSubmit(){
    if(isVerified===false){
      toast("Your email is not verified.");
      return;
    }
    formdata.email=email;
    console.log(formdata.email)
    if(formdata.username==="" || formdata.email==="" || formdata.password===""){
    toast("Fill all entries to sign up.");
    return;
    }
    setLoading(true);
    try{
      const res=await fetch("/api/users/signup",{
      method:"POST",
      headers:{
      'Content-Type':'application/json',
      },
      body:JSON.stringify(formdata)
      });
      const data=await res.json();
      if(data.status===400){
      toast("You are already signed up");
      setLoading(false);
      return;
      }
      toast("signed up successfully.");
      router.push("/login");
    }catch(error){
        console.log("Error occured while singing up:",error.message);
        toast("Something went wrong.Try Again.");
      }
      setLoading(false);
    }
    return (
      <div className="p-3 pt-24 max-w-lg mx-auto">
      <h1 className="text-xl text-center font-[700] my-5 font-serif">Sign Up</h1>
      <div className="flex flex-col gap-3">
      {
        isVerified===false && isClicked===false && <div className="flex flex-col gap-2.5">
        <input
        name="email"
        id="email"
        type="email"
        placeholder="Email"
        required
        onChange={(e)=>handleChange(e)}
        className="border p-2.5 rounded-lg font-[500] outline outline-1 outline-slate-300"
        />
        {
          formdata.email && 
          <button onClick={()=>handleSendEmail()}  className="hover:bg-slate-800 hover:text-white border-2 border-slate-800 bg-white text-slate-800 transition duration-300 ease-in-out  p-2.5 rounded-md font-semibold">{loading===true?"Please wait! we are Sending...":"verify Email"}</button>
        }
        </div>
      }
      {
        isVerified===true && <div className="flex items-center gap-2">
        <span className="text-green-400">
        <CgCheckO fontSize={20}/>
        </span>
        <p className="text-slate-500 font-semibold">Email Verified.</p>
        </div>
      }
      {
        isVerified===false && isClicked===true && <div className="flex items-center gap-2">
        <span className="text-green-400">
        <CgCheckO fontSize={20}/>
        </span>
        <p className="text-slate-500 font-semibold">Please check.We have sent an email to verify your email.</p>
        </div>
      }
      <input
      name="username"
      id="username"
      type="text"
      required
      placeholder="Username"
      onChange={(e)=>handleChange(e)}
      className="border p-2.5 rounded-lg font-[500] outline outline-1 outline-slate-300"
      />
      
      <input
      name="password"
      id="password"
      required
      type={visible?"text":"password"}
      placeholder="Password"
      onChange={(e)=>handleChange(e)}
      className="border p-2.5 rounded-lg font-[500] outline outline-1 outline-slate-300"
      />
      <div className="flex gap-3 items-center">
        <input type="checkbox" onClick={()=>setVisible(!visible)} className="w-4 h-4" />
        <span>show password</span>
      </div>
      <button onClick={()=>handleSubmit()}  className="hover:bg-slate-800 hover:text-white border-2 border-slate-800 bg-white text-slate-800 transition duration-300 ease-in-out  p-2.5 rounded-md font-semibold">{loading?"Loading":"SIGN UP"}</button>
      <Oauth authType={"signup"} />
      </div>
      <div className="flex mt-3 gap-2">
        <p>Have an account?</p>
        <Link href={"/login"} className="text-blue-500 font-semibold ">Login</Link>
      </div>
      <ToastContainer/>
      </div>
    );
}