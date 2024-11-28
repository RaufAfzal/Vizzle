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

    const { userId } = req.params

    if (!content) {
        throw new ApiError(400, "User Id is required")
    }

    const userTweets = await Tweet.find({
        owner: userId
    })

    if (!userTweets) {
        throw new ApiError(500, "No Tweets with the particular user find")
    }

    return res.status(201).json(
        new ApiResponse(201, userTweets, "User Tweets fetched successfully")
    )

})

const updateTweet = asyncHandler(async (req, res) => {

    const { tweetId } = req.params

    const { content } = req.body

    if (!tweetId) {
        throw new ApiError(400, "Tweet id is required")
    }

    if (!content) {
        throw new ApiError(400, "Content is required")
    }

    const updatedTweet = await Tweet.findOneAndUpdate(
        { _id: tweetId },
        {
            $set: {
                content
            }
        },
        {
            new: true
        }
    )

    return res.status(201).json(
        new ApiResponse(201, updatedTweet, "Tweet Updated fetched successfully")
    )

})

const deleteTweet = asyncHandler(async (req, res) => {

    const { tweetId } = req.params

    if (!tweetId) {
        throw new ApiError(400, "Tweet id is required")
    }

    const deleteTweet = await Tweet.findOneAndDelete(
        { _id: tweetId }
    )

    return res.status(201).json(
        new ApiResponse(201, deleteTweet, "Tweet Deleted successfully")
    )

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}