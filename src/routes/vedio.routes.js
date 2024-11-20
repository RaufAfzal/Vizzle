import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/auth.js";
import {
    getVedioById,
    publishAVedio,
    updateVedio
} from "../controllers/vedioController.js";


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

router.route("/:id")
    .get(getVedioById)
    .patch(upload.single("thumbnail"), updateVedio)


export default router
