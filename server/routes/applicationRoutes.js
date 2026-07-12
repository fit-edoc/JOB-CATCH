import express from "express";
import userAuth from "../middleware/authHandler.js";
import {
  applyJobController,
  getSeekerApplicationsController,
  getJobApplicationsController,
  updateApplicationStatusController
} from "../controller/applicationController.js";

const router = express.Router();

// Apply for a job (seeker)
router.post("/apply", userAuth, applyJobController);

// Get seeker's applications (seeker)
router.get("/my-applications", userAuth, getSeekerApplicationsController);

// Get applications for a job (employer)
router.get("/job-applicants/:jobId", userAuth, getJobApplicationsController);

// Update application status stage (employer)
router.patch("/status/:id", userAuth, updateApplicationStatusController);

export default router;
