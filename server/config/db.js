import mongoose from "mongoose";

const  dbConnect = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
            console.log("database has been connected");
            
        

    }
    catch(err){
        console.error(err);
        

    }
}

export default dbConnect