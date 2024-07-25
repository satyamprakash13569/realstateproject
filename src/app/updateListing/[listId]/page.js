'use client'
import { useRouter} from "next/navigation";
import { useEffect,useState } from "react"
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function updateListing(){
    const router=useRouter();
    const [files,setFiles]=useState([]);
    const [loading,setLoading]=useState(1);
    const [listId,setListId]=useState("");
    const [formdata,setFormData]=useState({
        name:"",
        mo:"",
        address:"",
        type:"rent",
        bedrooms:1,
        bathrooms:1,
        regularPrice:0,
        discountedPrice:0,
        offer:false,
        parking:false,
        furnished:false,
        userRef:"",
        imageUrls:[]
    });
    function handleChange(e){
        if(e.target.name==='sale' || e.target.name==='rent'){
            setFormData({...formdata,type:e.target.name});
        }
        else if(e.target.name==='parking' || e.target.name==='offer' || e.target.name==='furnished'){
            setFormData({...formdata,[e.target.name]:e.target.checked});
        }
        else{
            setFormData({...formdata,[e.target.name]:e.target.value});
        }
    }
    function handleFileChange(e){
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length + files.length+formdata.imageUrls.length +2>8){
          toast(`Maximum ${8-formdata.imageUrls.length} images are allowed`);
          return;
        }
        let imageFiles = selectedFiles.filter(file =>file.size < 2 * 1024 * 1024); // 2MB limit
        imageFiles = imageFiles.map(file => {
            return Object.assign(file, { preview: URL.createObjectURL(file)});
        }); 
        console.log(imageFiles); 
        setFiles(prevFiles =>[...prevFiles, ...imageFiles]);
    }
    function DeleteFile(ind){
        setFiles(files.filter((file,index)=>index!==ind));
    }
    async function imageUploader(){
        try{
            setLoading(2);
            const uploadedImageUrls = [];
            // Upload images to Cloudinary and get secure URLs
            for(let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append("file", files[i]);
                formData.append("upload_preset", "RealEstate");
                const res = await fetch(
                    "https://api.cloudinary.com/v1_1/dc98hldnd/image/upload",
                    {
                        method: "POST",
                        body: formData,
                    }
                );
                const data = await res.json();
                uploadedImageUrls.push(data.secure_url); 
            }
            setFormData(prevFormData => ({
                ...prevFormData,
                imageUrls: [...prevFormData.imageUrls, ...uploadedImageUrls]
            }));     
            setFiles([]);
            toast("Images uploaded successfully.");
        }catch(error){
        console.log("Error occured while uploading images.",error);
        toast("Error occured while uploading images");
        }
        setLoading(1);
    }
    async function handleUpdateListing(e){
        e.preventDefault();
        try {
            if(formdata.imageUrls.length==0){
                toast("You must have to upload at least one image.");
                return;
            }
            if(formdata.regularPrice<=formdata.discountedPrice){
                toast("Discounted price must be less than Regular price");
                return;
            }
            setLoading(3);
            const res=await fetch(`/api/listing/editListing/${listId}`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formdata)
            });
            const data=await res.json();
            toast("Updated Successfully.");
            router.push(`/listing/${data.updatedListing._id}`);
        } catch(error) {
            toast("Error Occurred! Try Again.");
            console.log(error);
        }
        setLoading(1)
    }
    async function DeleteFromCloud(ind){
        try{
          setLoading(4);
          const res=await fetch("/api/cloud/deleteImage",{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify({listId:listId,secure_url:formdata.imageUrls[ind]})
          });
          const data=await res.json();
          console.log(data);
          setFormData(preFormData=>({
            ...preFormData,
            imageUrls:formdata.imageUrls.filter((url,index)=>index!=ind)
          }));
          toast("Delete Successfully.");
        }catch(error){
            toast("Error occured.Try Again.");
            console.log("Error occured while deleting image from cloud->",error);
        }
        setLoading(1);
    }
    useEffect(()=>{
        const id = window.location.href.split('/')[4];
        setListId(id);
        async function fetchListing(){
           try{
            const res=await fetch(`/api/listing/getOneListing/${id}`);
            const data=await res.json();
            setFormData(data.listing);
           }catch(error){
            toast("Error occured.Try Again.")
            console.log("Error occured while fetching listing info:->",error);
           }
        }
        fetchListing();
    },[]);
    
    return(
        <main className="p-3 pt-8 max-w-4xl mx-auto">
            <div className="text-2xl font-bold text-center my-7">Update Listing</div>
            <form onSubmit={(e)=>handleUpdateListing(e)} className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-4 flex-1">
                    <input 
                    type="text" 
                    placeholder="Name"
                    name="name"
                    required
                    className="border p-2.5 rounded-lg"   
                    onChange={(e)=>handleChange(e)}
                    value={formdata.name}
                    />
                    <input
                    type="text" 
                    placeholder="Contact Number"
                    name="mo"
                    required
                    className="border p-2.5 rounded-lg"  
                    onChange={(e)=>handleChange(e)}
                    value={formdata.mo} 
                    />
                    <input 
                    type="text" 
                    placeholder="Address"
                    name="address"
                    required
                    className="border p-2.5 rounded-lg" 
                    onChange={(e)=>handleChange(e)}
                    value={formdata.address}  
                    />
                    <div className="flex gap-4 flex-wrap">
                    <div className="flex gap-2">
                    <input type="checkbox" name="sale" onChange={(e)=>handleChange(e)} checked={formdata.type==='sale'} className="w-5 font-semibold"/>
                    <span className="font-[500]">Sale</span>
                    </div>
                    <div className="flex gap-2">
                    <input type="checkbox" name="rent" onChange={(e)=>handleChange(e)} checked={formdata.type==='rent'} className="w-5 font-semibold"/>
                    <span className="font-[500]">Rent</span>
                    </div>
                    <div className="flex gap-2">
                    <input type="checkbox" name="parking" onChange={(e)=>handleChange(e)} checked={formdata.parking} className="w-5 font-semibold"/>
                    <span className="font-[500]">Parking Spot</span>
                    </div>
                    <div className="flex gap-2">
                    <input type="checkbox" name="offer" onChange={(e)=>handleChange(e)} checked={formdata.offer} className="w-5 font-semibold"/>
                    <span className="font-[500]">Offer</span>
                    </div>
                    <div className="flex gap-2">
                    <input type="checkbox" name="furnished" onChange={(e)=>handleChange(e)} checked={formdata.furnished} className="w-5 font-semibold"/>
                    <span className="font-[500]">Furnished</span>
                    </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <input 
                        type="number"  
                        name="bedrooms" 
                        min={1}
                        max={10}
                        value={formdata.bedrooms}
                        required
                        onChange={(e)=>handleChange(e)}
                        className="px-2 py-2 border-[1px] border-gray-500 rounded-lg"
                        />
                        <span className="font-[500]">Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input 
                        type="number"  
                        name="bathrooms" 
                        min={1}
                        max={10}
                        value={formdata.bathrooms}
                        required
                        onChange={(e)=>handleChange(e)}
                        className="px-2 py-2 border-[1px] border-gray-500 rounded-lg"
                        />
                        <span className="font-[500]">bathrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input 
                        type="number"  
                        name="regularPrice" 
                        min={0}
                        max={1000000}
                        value={formdata.regularPrice}
                        required
                        onChange={(e)=>handleChange(e)}
                        className="px-2 py-2 border-[1px] border-gray-500 rounded-lg"
                        />
                        <div className="flex flex-col">
                        <span className="font-[500]">Regular price</span>
                        <span className="text-sm">{formdata.type==='sale'? '($)':'($ / months)'}</span>
                        </div>
                    </div>
                    {
                        formdata.offer && (
                        <div className="flex items-center gap-2">
                        <input 
                        type="number"  
                        name="discountedPrice" 
                        min={0}
                        max={1000000}
                        value={formdata.discountedPrice}
                        required
                        onChange={(e)=>handleChange(e)}
                        className="p-2 border-[1px] border-gray-500 rounded-lg"
                        />
                        <div className="flex  flex-col">
                        <span className="font-[500]">Discounted price</span>
                        <span className="text-sm">{formdata.type==='sale'? '($)':'($ / months)'}</span>
                        </div>
                    </div>)
                    }
                    </div>
                    </div>
                <div className="flex flex-col gap-2 flex-1">
                {  
                    formdata.imageUrls.length>0 && <div>
                    <h2 className="font-semibold">Uploaded Images:</h2>
                    <p className="text-sm">Deletion will allow to upload more new images</p>
                    <div className="flex gap-x-5 flex-wrap">
                    { formdata.imageUrls.map((url,index) => (
                    <div className="flex flex-col p-2 gap-2" key={index}>
                    <img src={url} alt="listing image" className="w-28 h-28 object-contain rounded-lg"/>
                    <button disabled={loading==2 || loading==3 || loading==4} onClick={()=>DeleteFromCloud(index)} type="button"  className="p-1 text-sm font-semibold rounded-md hover:text-white hover:bg-red-500 text-red-500 :bg-white transition duration-300 ease-in-out border border-red-500">Delete</button>
                    </div>
                    ))}
                    </div>
                    </div>
                }
                <p className="font-semibold">New Images(maximum {8-formdata.imageUrls.length}):</p>
                <input 
                type="file"
                accept="image/*"
                multiple
                className="p-3 border border-gray-600 rounded-lg"
                onChange={(e)=>handleFileChange(e)}
                />
                <div className="flex gap-x-5 flex-wrap">
                {
                    files.length>0 && files.map((file,index) => (
                    <div className="flex flex-col p-2 gap-2" key={index}>
                    <img src={file.preview} alt="listing image" className="w-28 h-28 object-contain rounded-lg"/>
                    <button disabled={loading==2 || loading==3 || loading==4} onClick={()=>DeleteFile(index)} type="button"  className="p-1 text-sm font-semibold rounded-md hover:text-white hover:bg-red-500 text-red-500 :bg-white transition duration-300 ease-in-out border border-red-500">Delete</button>
                    </div>
                    ))
                }
                </div>
                <button disabled={loading===2 || loading==3 || loading==4} type="button" onClick={()=>imageUploader()} className="p-2.5 text-green-500 hover:text-white hover:bg-green-500 bg-slate-white rounded-md border border-green-500 transition duration-300 ease-in-out">{loading===2?"UPLOADING":"UPLOAD"}</button>
                <button disabled={loading===2 || loading==3 || loading==4} className="p-2.5 text-white hover:text-slate-800 hover:bg-white bg-slate-800 rounded-md border border-slate-800 transition duration-300 ease-in-out">{loading===3?"UPDATING":"UPDATE LISTING"}</button>
                </div>
            </form>
            <ToastContainer/>
        </main>
    )
}