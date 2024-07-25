'use client';
import Link from "next/link";
import { BiSolidRightArrowAlt } from "react-icons/bi";
export default function Home(){
  return (
    <div className="h-full w-full relative">
    <img src="/bgi.jpg" className="h-full w-full z-2 absolute"/>
    <div className="flex flex-col gap-3  max-w-6xl z-5 absolute right-[50%] bottom-[60%]">
      <h1 className="text-black font-bold text-3xl lg:text-4xl">
        Find next perfect place with ease
      </h1>
      <div className="text-black text-xs sm:text-sm font-bold">
      satyamEstate is the best place to find your next perfect place to live.
      <br/>
      we have wide range of properties for you to choose from.
      </div>
      <Link href="/login" className="flex items-center"> <span className="font-bold">Let's get started </span><BiSolidRightArrowAlt  fontSize={20}/></Link>
    </div>
    </div>
  );
}
