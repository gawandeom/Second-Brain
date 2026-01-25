import {Router} from "express"
import { shareLink, showdataViaLink } from "../controller/link.controller"
import verifyJwt from "../middleware/auth.middlewares"

const router = Router()

router.post('/share',verifyJwt,shareLink)

router.get('/:shareLink',showdataViaLink)

export default router