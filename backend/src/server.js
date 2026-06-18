import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import applicationRoutes from './routes/application.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

dotenv.config()
const app=express()
const PORT=process.env.PORT || 5000

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json())


//routes
app.use('/api/applications',applicationRoutes)


//middleware
app.use(notFound)
app.use(errorHandler)

app.listen(PORT, ()=>{
    console.log(`Server is running on http:/localhost:${PORT}`)
})
