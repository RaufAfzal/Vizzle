import mongoose from "mongoose";
import { sendEmail } from "../services/emailService.js";
import { Vedio } from "../models/Vedio.js";
import { vedioPublishTemplate } from "../utils/emailTemplate.js";
import { vedioQueue } from "../services/vedioQueueService.js";
import connectDB from "../db/dbConn.js";


const waitForDBConnection = async () => {
    try {
        await connectDB();

    } catch (error) {
        console.error("Error connecting to database:", error);
        process.exit(1);
    }
}

//process the vedio job

vedioQueue.process(async (job) => {

    await waitForDBConnection();

    try {
        const { vedioId, vedioDetails, userDetails } = job.data;

        await Vedio.findByIdAndUpdate(vedioId, { isPublished: true, publishAt: new Date() }, { maxTimeMS: 30000 });

        await sendEmail(
            userDetails.email,
            "Your Vedio is Now live!",
            vedioPublishTemplate(userDetails.username, vedioDetails.title, vedioDetails.url)
        )
    }
    catch (error) {
        console.error("Error processing vedio job:", error);
        throw error;
    }
})
