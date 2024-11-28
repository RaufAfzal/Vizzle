import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
} from "../controllers/tweetsController.js";


const router = Router();
router.use(verifyJWT)


router.route("/").post(createTweet);
router.route("/user/:userId").get(getUserTweets);
router.route("/:tweetId")
    .patch(updateTweet)
    .delete(deleteTweet)

export default router