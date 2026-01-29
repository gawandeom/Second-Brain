import {Router} from "express"
import { changePassword, loginUser, logout, registerUser, updateProfile } from "../controller/user.controller"
import verifyJwt from "../middleware/auth.middlewares"

const router = Router()
router.post('/register',registerUser)
router.post ('/login',loginUser)
router.post('/logout',verifyJwt,logout)
router.post('/change-password',verifyJwt,changePassword)
router.post('/update-profile',verifyJwt,updateProfile)


export default router