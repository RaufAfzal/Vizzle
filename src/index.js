import dotenv from "dotenv"
import connectDB from "./db/dbConn.js";
import { app } from './app.js'
import { vedioQueue } from "./services/vedioQueueService.js";


dotenv.config({
    path: './.env'
})



connectDB()
    .then(async () => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    })