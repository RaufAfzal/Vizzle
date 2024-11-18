import { Router } from "express";
import { registerUser } from "../controllers/userController.js";
import { upload } from "../middlewares/multer.js";
import { login } from "../controllers/userController.js";
import { verifyJWT } from "../middlewares/auth.js";
import { logOut } from "../controllers/userController.js";
import { refreshAccessToken } from "../controllers/userController.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(login)


//secured routes

router.route("/logOut").post(verifyJWT, logOut)
router.route("/refreshToken").post(refreshAccessToken)

export default router