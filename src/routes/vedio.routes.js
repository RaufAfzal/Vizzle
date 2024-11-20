import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/auth.js";
import { publishAVedio } from "../controllers/vedioController.js";


const router = Router();
router.use(verifyJWT)

router.route('/').post(
    upload.fields([
        {
            name: "vedioFile",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    publishAVedio
)

export default router
