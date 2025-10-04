import express from 'express'
import { createJobcontroller, deleteJobcontroller, getJobController, updateJobcontroller } from '../controller/jobController.js'
import userAuth from '../middleware/authHandler.js'


const router = express.Router()



router.post("/createjob",userAuth,createJobcontroller)
router.get("/getjobs" ,userAuth,getJobController)
router.patch("/updatejob/:id",userAuth,updateJobcontroller)
router.delete("/deletejob/:id",userAuth,deleteJobcontroller)

export default router