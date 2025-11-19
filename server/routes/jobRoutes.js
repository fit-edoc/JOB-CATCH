import express from 'express'
import { createJobcontroller, deleteJobcontroller, getJobController, updateJobcontroller } from '../controller/jobController.js'
import userAuth from '../middleware/authHandler.js'
import jobModel from '../model/jobModel.js'


const router = express.Router()



router.post("/createjob",userAuth,createJobcontroller)
router.get("/getjobs" ,getJobController)
router.patch("/updatejob/:id",userAuth,updateJobcontroller)
router.delete("/deletejob/:id",userAuth,deleteJobcontroller)


router.post("/seed-jobs", async (req, res) => {
  try {
    const jobs = req.body; // send 20 JSON objects from frontend or Postman
    const result = await jobModel.insertMany(jobs);

    res.json({ success: true, inserted: result.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router