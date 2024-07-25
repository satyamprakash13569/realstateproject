import mongoose from "mongoose"
export default async function dbConfig(){
    mongoose.connect(process.env.MONGODB_URL)
    .then(console.log("Database connected successfully."))
    .catch((error)=>{
        console.log("Error occured while database connection:",error.message);
        process.exit(1);
    })
};