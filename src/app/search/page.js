'use client'
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import Card from '../card/card';

export default function Search() {
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const options1 = [
    { value: "sale", label: "sale" },
    { value: "Rent", label: "Rent" },
    { value: "Both", label: "Both" },
  ];
  const options2 = [
    { value: "Mumbai", label: "Mumbai" },
    { value: "Dehli", label: "Dehli" },
    { value: "Kolkata", label: "Kolkata" },
    { value: "Chennai", label: "Chennai" },
    { value: "Hyderabad", label: "Hyderabad" },
    { value: "Bengluru", label: "Bengluru" },
    { value: "Pune", label: "Pune" },
    { value: "Chandigargh", label: "Chandigargh" },
    { value: "Lukhnow", label: "Lukhnow" },
    { value: "Kanpur", label: "Kanpur" },
    { value: "Patna", label: "Patna" },
    { value: "Allahabad", label: "Allahabad" },
    { value: "Raipur", label: "Raipur" },
    { value: "Surat", label: "Surat" },
    { value: "Ahamdabad", label: "Ahamdabad" },
    { value: "Bhopal", label: "Bhopal" },
    { value: "Banaras", label: "Banaras" },
    { value: "Ranchi", label: "Ranchi" },
  ];
  const [type, setType] = useState({ value: "sale", label: "sale" });
  const [city, setCity] = useState({ value: "Mumbai", label: "Mumbai" });

  async function handleSearch() {
    if (type === null || city === null) {
      toast("Please Select Options");
      return;
    }
    try {
      setLoading(true);
      let data = await fetch(`/api/listing/searchListing?city=${city.value}&type=${type.value}`);
      data = await data.json();
      console.log(data.listing);
      setListings(data.listing || []);
    } catch (error) {
      console.log(error);
      console.log("Error Occured:->", error.message);
      toast("Error Occured.");
    }
    setLoading(false);
  }

  useEffect(() => {
    async function fetcher() {
      try {
        let data = await fetch(`/api/listing/searchListing?city=${city.value}&type=${type.value}`);
        data = await data.json();
        setListings(data.listing || []);
        console.log(data);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    }
    fetcher();
  }, []);

  return (
    <div className="h-[100%] w-[100%] mt-[10%]">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div style={{ margin: 20, width: 200 }}>
          <Select options={options1} placeholder="Select Type" defaultValue={type} onChange={setType} />
        </div>
        <div style={{ margin: 20, width: 200 }}>
          <Select options={options2} placeholder="Select City" defaultValue={city} onChange={setCity} />
        </div>
        <button
          disabled={loading}
          onClick={handleSearch}
          className='outline outline-1 outline-slate-600 px-2 py-1 rounded-sm text-slate-600 font-semibold hover:bg-slate-600 hover:text-white transition-all ease-in-out duration-3'
        >
          Search
        </button>
      </div>
      <div className='flex justify-evenly items-center gap-4 p-8'>
        {
          Array.isArray(listings) && listings.length !== 0 ? (
            listings.map((listing, index) => (
              <Card Price={listing.discountedPrice} location={listing.address} imgUrl={listing.imageUrls[0]} mo={listing.mo} userRef={listing.userRef} key={index} id={listing._id} />
            ))
          ) : (
            <div className='flex flex-col justify-center items-center mt-[10%] gap-4'>
              <div className='font-bold text-7xl text-slate-500'>404</div>
              <p className='font-semibold text-slate-600 tracking-tight'>Not Found!</p>
            </div>
          )
        }
      </div>
      <ToastContainer />
    </div>
  );
}
