import dotenv from "dotenv"
dotenv.config()
import express, { Request, Response } from "express"
import cookieParser from "cookie-parser"

const app = express()

app.use(express.json())
app.use(cookieParser())


import userRouter from "./routes/user.routes"
app.use('/api/v1/users',userRouter)

import contentRouter from "./routes/content.routes"
app.use('/api/v1/content',contentRouter)

import shareRouter from "./routes/share.routes"
app.use("/api/v1/brain",shareRouter)
app.get('/health',(req:Request,res:Response)=>{

})

export default app;