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


const getVedioById = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!id) {
        throw new ApiError(400, "Vedio Id is required")
    }

    const vedio = await Vedio.findById(id)

    if (!vedio) {
        throw new ApiError(400, "Vedio not found")
    }

    return res.status(200).json(
        new ApiResponse(200, vedio, "vedio fetched successfully")
    )
})


const updateVedio = asyncHandler(async (req, res) => {
    const { id } = req.params

    const { title, description } = req.body

    const thumbnail = req.file.path

    if (!(title || description || thumbnail)) {
        throw new ApiError(400, "title desctiption and thumbnail required")
    }

    const thumbnailToCloudinary = await streamUploadToCloudinary(thumbnail)

    if (!thumbnailToCloudinary) {
        throw new ApiError(400, "Error while uploading to cloudinary")
    }

    const vedio = await Vedio.findByIdAndUpdate(
        id,
        {
            $set: {
                title,
                description,
                thumbnail: thumbnail?.url
            }
        },
        {
            new: true
        }
    )

    return res.status(200).json(
        new ApiResponse(200, vedio, "update vedio data successfully")
    )

})


export {
    publishAVedio,
    getVedioById,
    updateVedio
}