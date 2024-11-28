import { Router } from "express";
import {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
} from "../controllers/subscriptionController.js";
import { verifyJWT } from "../middlewares/auth.js";

const router = Router();
router.use(verifyJWT)

router
    .route("/channel/:channelId")
    .get(getUserChannelSubscribers)
    .post(toggleSubscription)


router.route("/user/:subscriberId").get(getSubscribedChannels)

export default router
