import express from 'express'
import {loginController, registerController, updateUserController, saveJobController, getSavedJobsController}  from '../controller/userAuth.js'
import userAuth from '../middleware/authHandler.js'


const router = express.Router()



router.post("/register",registerController)
router.post("/login",loginController)
router.put("/update",userAuth,updateUserController)
router.post("/save-job", userAuth, saveJobController)
router.get("/saved-jobs", userAuth, getSavedJobsController)



export default router