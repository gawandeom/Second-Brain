import {Router} from "express"
import { loginUser, registerUser } from "../controller/user.controller"
import verifyJwt from "../middleware/auth.middlewares"

const router = Router()
router.post('/register',registerUser)
router.post ('/login',loginUser)
router.get('/verify',verifyJwt,(req,res)=>{
    res.json({
        message:"ok"
    })
})


export default router