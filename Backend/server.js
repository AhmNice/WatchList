import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { connectDB } from './db/database.js'
import cors from 'cors'
import { authRoute, movieRoute, playlistRoute } from './routes/routes.js'

dotenv.config()
const app = express()
app.use(cors({
  origin:process.env.CLIENT_URL,
  credentials:true
}))
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoute)
app.use('/playlist', playlistRoute)
app.use('/movie', movieRoute)
const startServer = async()=>{
    console.log('Connecting....')
   try {
    await connectDB()
    app.listen(process.env.PORT,()=>{
      console.log('Server is up and running 🚀')
    })
   } catch (error) {
    console.log(error.message)
   }
}
startServer();