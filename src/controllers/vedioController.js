import { Vedio } from "../models/Vedio.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { streamUploadToCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getVedioDuration } from "../utils/vedioDuration.js";


const publishAVedio = asyncHandler(async (req, res) => {
    const { title, description } = req.body

    if (!(title && description)) {
        throw new ApiError(400, "All Field are required")
    }

    const vedioLocalPath = req.files?.vedioFile[0]?.path;
    const thumbnailPath = req.files?.thumbnail[0]?.path;

    if (!(vedioLocalPath || thumbnailPath)) {
        throw new ApiError(400, "Vedio file is required ")
    }

    const vedioDuration = await getVedioDuration(vedioLocalPath)

    const vedioFile = await streamUploadToCloudinary(vedioLocalPath)
    const thumbnail = await streamUploadToCloudinary(thumbnailPath)

    const vedio = await Vedio.create({
        title,
        description,
        vedioFile: vedioFile?.url || "",
        thumbnail: thumbnail?.url || "",
        duration: vedioDuration,
        owner: req?.user?._id
    })

    if (!vedio) {
        throw new ApiError(500, "Something went wtong while creating the vedio")
    }

    return res.status(201).json(
        new ApiResponse(201, vedio, "vedio published successfully")
    )

})


export {
    publishAVedio
}