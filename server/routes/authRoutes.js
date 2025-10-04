import express from 'express'
import {loginController, registerController, updateUserController}  from '../controller/userAuth.js'
import userAuth from '../middleware/authHandler.js'


const router = express.Router()



router.post("/register",registerController)
router.post("/login",loginController)
router.put("/update",userAuth,updateUserController)



export default router