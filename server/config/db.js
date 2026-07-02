import mongoose from "mongoose";
import { seedJobs } from "../utils/seeder.js";

const  dbConnect = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("database has been connected");
        await seedJobs();
    }
    catch(err){
        console.error(err);
        

    }
}

export default dbConnect