import {Router} from "express"
import { createContent } from "../controller/content.controller"
import verifyJwt from "../middleware/auth.middlewares"

const router = Router()

router.post('/add-content',verifyJwt,createContent)


export default router