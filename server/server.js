import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dbConnect from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import applicationRoutes from './routes/applicationRoutes.js'

dotenv.config()

dbConnect()


const app = express()
app.use(cors(
    {
        // origin:["http://localhost:5173","https://job-catch.vercel.app"],
        origin:"*",
        credentials:true
    }
))
app.use(helmet())
app.use(morgan())
app.use(express.json())

// 1. Custom NoSQL Injection Sanitization Middleware
const mongoSanitize = (req, res, next) => {
  const sanitize = (obj) => {
    if (obj instanceof Object) {
      for (const key in obj) {
        if (key.startsWith('$') || key.includes('.')) {
          delete obj[key];
        } else {
          sanitize(obj[key]);
        }
      }
    }
  };
  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  next();
};
app.use(mongoSanitize);

// 2. Global Rate Limiting (100 requests per 15 mins)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  limit: 100, 
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: "Too many requests from this IP, please try again later." }
});
app.use(globalLimiter);

// 3. Stricter Authentication & OTP Rate Limiter (15 attempts per 15 mins)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: "Too many login/OTP requests from this IP, please try again after 15 minutes." }
});
app.use("/api/user/login", authLimiter);
app.use("/api/user/send-otp", authLimiter);
app.use("/api/user/verify-otp", authLimiter);
app.use("/api/user/register", authLimiter);

app.use("/api/user",authRoutes)
app.use("/api/job",jobRoutes)
app.use("/api/application",applicationRoutes)


const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);
    
})