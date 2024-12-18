import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import { connectToDatabase } from './config/dbConnect.js'
import userRoute from './routes/userRoute.js'
const app = express()



app.use(cors())
app.use(express.json())
connectToDatabase()
app.use('/api/user/', userRoute)




app.listen('3000', () => {
    console.log("server running in port 3000")
})