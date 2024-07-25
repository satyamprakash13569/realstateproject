'use client'
import { useEffect, useState } from "react"
import { useParams } from "next/navigation";
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel'; 
import { FcAdvance } from "react-icons/fc";
import { FcRight } from "react-icons/fc";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineCheck } from "react-icons/ai";
import { AiOutlineArrowDown } from "react-icons/ai";
import { MdPhoneEnabled } from "react-icons/md";
import { CgMail } from "react-icons/cg";
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Listing(){
    const params=useParams();
    const [listing,setListing]=useState(null);
    useEffect(()=>{
        const id = window.location.href.split('/')[2];
        async function fetchListing(){
           try{
            const res=await fetch(`/api/listing/getOneListing/${params.id}`);
            const data=await res.json();
            setListing(data.listing);
           }catch(error){
            toast("Error occured.Try Again.");
            console.log("Error occured while fetching listing info:->",error);
           }
        }
        fetchListing();
    },[]);
    return(
        <div className="p-3 max-w-6xl mx-auto mt-24">
        <div className="w-[75%] mx-auto">
            {listing && (
                <Carousel>
                    {listing.imageUrls.map((imgUrl, index) => (
                        <div key={index}>
                            <img src={imgUrl} alt={`image${index}`}/> 
                        </div>
                    ))}
                </Carousel>
            )}
        </div>
        <div className="w-full flex justify-center items-center">
        <FcAdvance />
        <p className="text-xl text-slate-600">Property Details:-</p>
        </div>
        <div className=" w-full flex justify-evenly items-center">
        <div className="flex flex-col">
        {
        listing && <div className="text-lg flex items-center gap-2"> <FcRight/><p><span>Name:-</span> <span className="font-semibold text-slate-400">{listing.name}</span></p></div>
        }
        {
         listing && <div className="text-lg flex items-center gap-2"><FcRight/><p><span>Location:-</span><span className="font-semibold text-slate-400">{listing.address}</span></p></div>
        }
        {
            listing && <div className="text-lg flex items-center gap-2"><FcRight/><p><span>Type:-</span><span className="font-semibold text-slate-400">{listing.type}</span></p></div>
        }
        {
            listing && <div className="text-lg flex items-center gap-2"><FcRight/><p className="flex items-center gap-2"><span>Furnished:-</span>{listing.furnished===true?<AiOutlineCheck color="green" fontSize={30} />:<AiOutlineClose  color="red" fontSize={30}/>}</p></div>
        }
        {
            listing && <div className="text-lg flex items-center gap-2"><FcRight/><p className="flex items-center gap-2"><span>Parking spot:-</span>{listing.parking===true?<AiOutlineCheck color="green" fontSize={30} />:<AiOutlineClose  color="red" fontSize={30}/>}</p></div>
        }
        {
            listing && <div className="text-lg flex items-center gap-2"><FcRight/><p><span>Bedrooms:-</span><span className="font-semibold text-slate-400">{listing.bedrooms}</span></p></div>
        }
        </div>
        <div>
        {
            listing && <div className="text-lg flex items-center gap-2"><FcRight/><p className="flex items-center gap-2"><span>Bathrooms:-</span><span className="font-semibold text-slate-400">{listing.bathrooms}</span></p></div>
        }
        {
            listing && <div className="text-lg flex items-center gap-2"><FcRight/><p className="flex items-center gap-2"><span>Price:-</span><span className="font-semibold text-slate-400">{listing.offer==true?<strike>{listing.regularPrice}${listing.type==="rent"?"/month":""}</strike>:<span>{listing.regularPrice}${listing.type==="rent"?"/month":""}</span>}</span>{listing.offer===true?<AiOutlineArrowDown color="green" fontSize={30}/>:""}</p></div>
        }
        {
            listing && listing.offer===true &&<div className="text-lg flex items-center gap-2 px-20"><p><span className="font-semibold text-slate-400">{listing.discountedPrice}$ {listing.type==="rent"?"/month":""}</span></p></div>
        }
        {
            listing && <div className="text-lg flex items-center gap-2"><FcRight/>Get more Details:-</div>
        }
        {
            listing && <div className="text-lg flex items-center gap-2"><MdPhoneEnabled/>6207173085 (9AM-5PM)</div>
        }
        {
            listing && <div className="text-lg flex items-center gap-2"><CgMail/><a href="https://mail.google.com/mail/?view=cm&fs=1&to=satyamkumar13569@gmail.com.com&su=&body=." target="_blank">Mail us</a></div>
        }
        </div>
        </div>
        <ToastContainer/>
    </div> 
    )
} 
