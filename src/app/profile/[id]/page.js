'use client'
import { AppContext } from "@/context/AppContext";
import Image from "next/image";
import { useContext, useState } from "react";
import Link from "next/link";
import { ToastContainer, toast } from 'react-toastify';
import { CgCheckO } from "react-icons/cg";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
export default function Profile({params}) {
  const userId=params.id;
  const {username,setUserName,photoUrl,setPhotoUrl,email,setEmail}=useContext(AppContext);
  const [loading,setLoading]=useState(1);
  const [visible,setVisible]=useState(false);
  const [password,setPassword]=useState("");
  const [isUpdated,setIsUpdated]=useState(false);
  const [userListings,setUserListings]=useState([]);
  const router=useRouter();
  async function handleLogout(){
    try{
    await fetch("/api/users/logout");
    toast("Logged out successfully.");
    setEmail("");
    setUserName("");
    setPhotoUrl("");
    router.push("/");
    }catch(error){
      console.log("Error occured while logging out.",error.message);
      toast("Error occured! Try Again.")
    }
  }
  async function handleDelete(){
    try{
    await fetch("/api/users/deleteAccount",{
      method:"DELETE",
      headers:{
      'Content-Type':'application/json'
      },
      body:JSON.stringify({email:email})
    });
    toast("Your Account Deleted successfully.");
    setEmail("");
    setUserName("");
    setPhotoUrl("");
    router.push("/");
    }catch(error){
      console.log("Error occured while deleting out.",error.message);
      toast("Error occured! Try Again.")
    }
  }
  async function handleSave(){
    if(password===""){
      toast("Please fill New Password");
      return;
    }
    try{
      setLoading(2);
      const res=await fetch("/api/users/updatePassword",{
        method:"POST",
        headers:{
          'Content-Type':"application/json",
        },
        body:JSON.stringify({email:email,password:password})
      });
      setIsUpdated(true);
      toast("New Password Saved successfully.")
    }catch(error){
      console.log("Error occured while saving new password:->",error);
      toast("Error occured! Please Try Again");
    }
    setLoading(1);
   }
   async function handleShowListings(){
    try{
      setLoading(3)
      const res=await fetch(`/api/listing/getListings/${userId}`);
      const data=await res.json();
      setUserListings(data.listings);
    }catch(error){
      toast("Error occured while showing Listings");
      console.log(error);
    }
    setLoading(1);
   }
   async function handleDeleteListing(listId){
      try{
      const res=await fetch(`/api/listing/deleteListing/${listId}`,{
        method:"DELETE",
      })
      setUserListings((prev)=>prev.filter((listing)=>listing._id!=listId));
      toast("Listing Deleted.");
      }catch(error){
       toast("Error occurec while Deleting Listing.");
       console.log(error);
      }
   }
    return (
      <div className="p-10 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-center my-4 ">Profile</h1>
      <div className="flex flex-col gap-6">
        <Link href={`/avatar/${userId}`} className="rounded-full object-cover cursor-pointer self-center mt-2" >
        <Image src={photoUrl} alt="profile" height={50} width={50} className="rounded-full object-cover cursor-pointer self-center mt-2" />
        </Link>
        <input
        readOnly
        type="text"
        id="username"
        defaultValue={username}
        placeholder="username"
        className="outline outline-[1px] p-2.5 text-[0.9rem] rounded-md font-semibold "
        />
        <input readOnly type="text"
        id="email"
        value={email}
        placeholder="email"
        className="outline outline-[1px] p-2.5 rounded-md font-semibold opacity-75"
        />
        <input  type={visible?"text":"password"}
        name="newPassword"
        placeholder="Enter New Password"
        className="outline outline-[1px] p-2.5 rounded-md font-semibold opacity-75"
        onChange={(e)=>setPassword(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <input type="checkbox" onClick={()=>setVisible(!visible)} className="w-4 h-4" />
          <span>show password</span>
        </div>
        <button disabled={loading==2} onClick={()=>handleSave()}  className="hover:bg-slate-800 hover:text-white border-2 border-slate-800 bg-white text-slate-800 transition duration-300 ease-in-out  p-2.5 rounded-md font-semibold">{loading==2?"Saving":"Save New Password"}</button>
        {
          isUpdated && (<div className="flex  items-center gap-2">
          <span className="text-green-400">
          <CgCheckO fontSize={25}/>
          </span>
          <p className="text-slate-500 font-semibold">New password has been saved.</p>
          </div>
          )
        }
        <Link href={`/createListing?${userId}`} className="hover:bg-pink-600 hover:text-white text-center border-2 border-slate-800 hover:border-pink-600 bg-white text-slate-800 transition duration-300 ease-in-out  p-2.5 rounded-md font-semibold">Create Listing</Link>
      </div>
      <div className="flex flex-wrap justify-between items-center mt-4">
        <span onClick={()=>handleDelete()} className="text-red-700 text-sm font-semibold cursor-pointer">Delete Account ?</span>
        <span onClick={()=>handleLogout()} className="text-red-700 text-sm font-semibold  cursor-pointer">Log out ?</span>
      </div>
      <div className="flex justify-center items-center">
        <button disabled={loading==3} onClick={()=>handleShowListings()} className="text-green-700 text-sm font-semibold  cursor-pointer">{loading==3?"Loading":"Show Listings"}</button>
      </div>
      {userListings.length>0 && (
        <div className="mt-5">
        <h1 className="text-center font-semibold">Your Listings</h1>
        {userListings.map((listing)=>{
        return <div key={listing._id} className=" border border-slate-500  rounded-lg p-3 my-6 flex justify-between items-center">
          <Link href={`/listing/${listing._id}`}>
            <img src={listing.imageUrls[0]} alt="listing-cover" className="h-16 w-16 object-contain"/>
          </Link>
          <Link className="font-semibold text-slate-600 truncate hover:underline" href={`/listing/${listing._id}`}>
            <p>{listing.name}</p>
          </Link>
          <div className="flex flex-col gap-3">
            <button className="text-red-700 uppercase text-sm" onClick={()=>handleDeleteListing(listing._id)}>DELETE</button>
            <Link href={`/updateListing/${listing._id}`} className="text-green-700 uppercase text-sm">EDIT</Link>
          </div>
          </div>
        })}
        </div>)
      }
      <ToastContainer/>
    </div>
  );
}