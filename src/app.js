import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
// import './services/queueMonitor.js'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}))

// Middlewares 
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import userRouter from './routes/user.routes.js'
import vedioRouter from './routes/vedio.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'
import tweetRouter from './routes/tweet.routes.js'


app.use("/api/v1/users", userRouter)
app.use("/api/v1/vedios", vedioRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/tweets", tweetRouter)


export { app }