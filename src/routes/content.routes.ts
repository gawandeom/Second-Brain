import {Router} from "express"
import { createContent, getContent, getContentById } from "../controller/content.controller"
import verifyJwt from "../middleware/auth.middlewares"

const router = Router()

router.post('/add-content',verifyJwt,createContent)
router.get('/content',verifyJwt,getContent)
router.get('/content/:id',verifyJwt,getContentById)



export default router