import {Router} from "express"
import { loginUser, logout, registerUser } from "../controller/user.controller"
import verifyJwt from "../middleware/auth.middlewares"

const router = Router()
router.post('/register',registerUser)
router.post ('/login',loginUser)
router.post('/logout',verifyJwt,logout)


export default router