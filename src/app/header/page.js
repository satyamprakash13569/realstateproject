'use client'
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
export default function Header() {
  const {photoUrl,setUserName,setEmail,setPhotoUrl,setIsVerified,setUserId,userId}=useContext(AppContext);
  const router=useRouter();
  async function loginHandler(){
    try{
    let res=await fetch("/api/users/getUserDetails");
    res=await res.json();
    if(res.status===200){
      setUserName(res.user.username);
      setEmail(res.user.email);
      setIsVerified(true);
      setPhotoUrl(res.user.avatar);
      setUserId(res.user._id);
    }
    else{
      router.push('/login');
    }
    }catch(error){
    console.log("IN_SER_ERR. Try Again.")
    }
  }
  return (
    <header className="flex flex-wrap justify-evenly items-center md:h-[15vh] h-[20vh] mx-auto px-5 bg-gradient-to-r from-blue-200 to-cyan-200 fixed top-0 left-0 right-0 z-[100]">
    <Image src="/logo.png" alt="logo" width={60} height={60} className="rounded-full object-cover"/>
    <h1 className="text-[30px]">
    <span  className="text-slate-700 font-bold">Satyam</span>
    <span className="text-slate-400 font-bold">Estate</span>
    </h1>
    <ul className="flex justify-center items-center gap-x-10">
    <div  className="cursor-pointer flex flex-col group">
    <Link href={"/search"} className="hidden sm:inline text-slate-700 hover:text-slate-950 font-semibold transition duration-400 ease-in-out group">Search</Link>
    <div className=" w-15 h-1 rounded-md bg-transparent group-hover:bg-blue-950 "></div>
    </div>
    <div className="cursor-pointer flex flex-col group">
    <Link href={"/"} className="hidden sm:inline text-slate-700 hover:text-slate-950 font-semibold transition duration-400 ease-in-out">Home</Link>
    <div className=" w-15 h-1 rounded-md bg-transparent group-hover:bg-blue-950 "></div>
    </div>
    <div  className="cursor-pointer flex flex-col group">
    <Link href={"/about"} className="hidden sm:inline text-slate-700 hover:text-slate-950 font-semibold transition duration-400 ease-in-out group">About</Link>
    <div className=" w-15 h-1 rounded-md bg-transparent group-hover:bg-blue-950 "></div>
    </div>
    {
    photoUrl.length>0 && userId.length>0 ? (
      <Link href={`/profile/${userId}`} className="cursor-pointer">
        <Image src={photoUrl} alt="profile" height={50} width={50} className="rounded-full object-contain"></Image>
      </Link>
    ):
    (
    <div  className="cursor-pointer flex flex-col group">
    <button onClick={()=>loginHandler()} className="sm:inline text-slate-700 hover:text-slate-950 font-semibold transition duration-400 ease-in-out group">Login</button>
    <div className=" w-15 h-1 rounded-md bg-transparent group-hover:bg-blue-950 "></div>
    </div>
    )
    }
    </ul>
    </header>
  )
}
