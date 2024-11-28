import { Tweet } from "../models/Tweet.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createTweet = asyncHandler(async (req, res) => {

    const { content } = req.body

    if (!content) {
        throw new ApiError(400, "Content is required")
    }

    const userId = req?.user?._id

    if (!userId) {
        throw new ApiError(400, "User id is required")
    }

    const createTweet = await Tweet.create({
        content: content,
        owner: userId
    })


    if (!createTweet) {
        throw new ApiError(500, "Something went wrong while creating the tweet")
    }

    return res.status(201).json(
        new ApiResponse(201, createTweet, " Tweet created successfully")
    )

})

const getUserTweets = asyncHandler(async (req, res) => {

})

const updateTweet = asyncHandler(async (req, res) => {

})

const deleteTweet = asyncHandler(async (req, res) => {

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}