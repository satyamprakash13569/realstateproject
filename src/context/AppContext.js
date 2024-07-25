'use client'
import { createContext } from "react"
import { useState } from "react";
// create context
export const AppContext=createContext();
// create context provider component
export default function AppContextProvider({children}){
    const [username,setUserName]=useState("");
    const [email,setEmail]=useState("");
    const [photoUrl,setPhotoUrl]=useState("");
    const [isVerified,setIsVerified]=useState(false);
    const [userId,setUserId]=useState("");
    const userData={
        username,
        email,
        photoUrl,
        isVerified,
        setUserName,
        setEmail,
        setPhotoUrl,
        setIsVerified,
        userId,
        setUserId
    }
    // providing context
    return(
    <AppContext.Provider value={(userData)}>
    {children}
    </AppContext.Provider>
    )
}