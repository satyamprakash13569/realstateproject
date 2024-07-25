import Link from "next/link"
export default function Card({location,Price,imgUrl,mo,id}){
    return(
        <div className="flex flex-col items-center gap-1 w-[350px] outline outline-1 outline-slate-600 rounded-sm">
            <img src={imgUrl} alt="" height={350} width={350} className="object-contain" />
            <div className="flex justify-between w-full  p-4 ">
            <div className="flex flex-col w-full">
                <span className="font-semibold text-slate-800">
                      Price:<span className="font-semibold text-gray-500">{Price}$</span>
                </span>
                <span className="font-semibold text-slate-800 "> 
                      Location:<span className="font-semibold text-blue-400">{location}</span>
                </span>
            </div>
            <div className="flex flex-col w-full">
                <span className="font-semibold text-slate-800">
                      mo:<span className="font-semibold text-green-500">{mo}</span>
                </span>
                <Link href={`/listing/${id}`} className="font-semibold text-slate-800 ">Get more Details</Link>
            </div>
            </div>
        </div>
    )
}