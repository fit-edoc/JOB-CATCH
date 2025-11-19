import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import dbConnect from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import jobRoutes from './routes/jobRoutes.js'

dotenv.config()

dbConnect()


const app = express()
app.use(cors(
    {
        origin:["http://localhost:5173"," https://b9d6875587a9.ngrok-free.app "],
        credentials:true
    }
))
app.use(helmet())
app.use(morgan())
app.use(express.json())

app.use("/api/user",authRoutes)
app.use("/api/job",jobRoutes)


const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);
    
})