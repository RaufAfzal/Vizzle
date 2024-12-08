import { emailQueue } from "../services/emailQueueService.js";
import { sendEmail } from "../services/emailService.js";
import { registrationTemplate, loginNotificationTemplate } from "../utils/emailTemplate.js";

//process email jobs
emailQueue.process(async (job) => {
    try {
        const { to, type, data } = job.data;

        let subject, html;

        if (type === "registration") {
            subject = "Welcome to vizzle";
            html = registrationTemplate(data.username);
        } else if (type === "login") {
            subject = "Login Alert";
            html = loginNotificationTemplate(data.username);
        } else {
            throw new Error("Invalid email type");
        }

        // Send Email
        await sendEmail(to, subject, html);
    } catch (error) {
        console.error("Error processing job:", error);
        throw error;  // Rethrow error so that Bull can handle retry or failure
    }
});