import { format } from 'date-fns';
import { Vedio } from "../models/Vedio.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { streamUploadToCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getVedioDuration } from "../utils/vedioDuration.js";
import { addVedioJob } from "../services/vedioQueueService.js";


const getAllVedios = asyncHandler(async (req, res) => {

    const { page = 1, limit = 10, query, sortBy = 'createdAt', sortType = 'desc', userId } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;


    const sortOrder = sortType === 'asc' ? 1 : -1;

    let filter = {}

    if (query) {
        filter = {
            ...filter,
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        }
    }

    if (userId) {
        filter = { ...filter, owner: userId };
    }

    const sortCriteria = {};
    sortCriteria[sortBy] = sortOrder

    const aggregationPipeline = [

        { $match: filter },

        { $sort: sortCriteria },

        { $skip: skip },

        { $limit: limitNum }

    ]

    const [vedios, totalVedios] = await Promise.all([
        Vedio.aggregate(aggregationPipeline),
        Vedio.countDocuments(filter)
    ]);

    res.status(200).json(
        new ApiResponse(200, {
            vedios,
            totalVedios,
            page: pageNum,
            totalPage: Math.ceil(totalVedios / limitNum)
        }, "Vedios Fetched Successfully")
    )
})


const publishAVedio = asyncHandler(async (req, res) => {
    const { title, description, publishAt } = req.body

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
        owner: req?.user?._id,
        isPublished: !publishAt,
        publishAt: publishAt ? new Date(publishAt) : undefined
    })

    if (!vedio) {
        throw new ApiError(500, "Something went wrong while creating the vedio")
    }

    if (publishAt) {

        const publishDate = new Date(publishAt);
        const currentTime = new Date();
        const delay = publishDate.getTime() - currentTime.getTime()

        if (delay <= 0) {
            throw new ApiError(400, "Publish time must be in the future");
        }

        await addVedioJob({
            vedioId: vedio._id,
            vedioDetails: {
                title: vedio.title,
                url: vedio.vedioFile
            },
            userDetails: {
                userId: req.user._id,
                email: req.user.email,
                username: req.user.username
            }
        }, delay)
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

const deleteVedio = asyncHandler(async (req, res) => {
    const { id } = req.params

    const vedio = await Vedio.findByIdAndDelete(
        id,
        {
            new: true
        }
    )

    return res.status(200).json(
        new ApiResponse(200, vedio, "vedio deleted successfully")
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { vedioId } = req.params

    if (!vedioId) {
        throw new ApiError(400, "vedio id is required")
    }
    const { isPublished } = req.body

    if (typeof isPublished !== "boolean") {
        throw new ApiError(400, "Published status must be boolean either true ot false")
    }

    const vedio = await Vedio.findByIdAndUpdate(
        vedioId,
        {
            $set: {
                isPublished
            }
        },
        {
            new: true
        }
    )

    return res.status(200).json(
        new ApiResponse(200, vedio, "vedio status changed successfully")
    )
})


export {
    publishAVedio,
    getVedioById,
    updateVedio,
    deleteVedio,
    togglePublishStatus,
    getAllVedios,
}