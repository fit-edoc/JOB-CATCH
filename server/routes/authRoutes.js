import express from 'express'
import {loginController, registerController, updateUserController, saveJobController, getSavedJobsController, verifyPortfolioController, generateSkillAssessmentController, submitSkillAssessmentController, startAIInterviewController, evaluateAIInterviewController, verifyRecruiterController, recruiterResumeSearchController, extractSkillsController, getMyReferralsController, recruiterGenerateEmailController, getPortfolioBadgeController, sendOtpController, verifyOtpController}  from '../controller/userAuth.js'
import userAuth from '../middleware/authHandler.js'


const router = express.Router()



router.post("/register",registerController)
router.post("/login",loginController)
router.post("/send-otp",sendOtpController)
router.post("/verify-otp",verifyOtpController)
router.put("/update",userAuth,updateUserController)
router.post("/save-job", userAuth, saveJobController)
router.get("/saved-jobs", userAuth, getSavedJobsController)
router.post("/verify-portfolio", userAuth, verifyPortfolioController)
router.post("/skill-assessment/generate", userAuth, generateSkillAssessmentController)
router.post("/skill-assessment/submit", userAuth, submitSkillAssessmentController)
router.post("/ai-interview/start", userAuth, startAIInterviewController)
router.post("/ai-interview/evaluate", userAuth, evaluateAIInterviewController)
router.post("/verify-recruiter", userAuth, verifyRecruiterController)
router.post("/recruiter/resume-search", userAuth, recruiterResumeSearchController)
router.post("/extract-skills", userAuth, extractSkillsController)
router.get("/my-referrals", userAuth, getMyReferralsController)
router.post("/recruiter/generate-email", userAuth, recruiterGenerateEmailController)
router.get("/portfolio-badge/:userId", getPortfolioBadgeController)



export default router