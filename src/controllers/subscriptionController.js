import { Subscription } from "../models/Subscription.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    const userId = req?.user?._id

    if (!channelId) {
        throw new ApiError(400, "Channel Id is required")
    }

    if (!userId) {
        throw new ApiError(400, "User Id is required")
    }

    const existingSubscriber = await Subscription.findOne({
        subscriber: userId,
        channel: channelId
    })


    if (existingSubscriber) {
        await Subscription.findOneAndDelete({ _id: existingSubscriber._id })
        return res.status(200).json(
            new ApiResponse(200, existingSubscriber, "unsubscribed successfully")
        )
    }

    const newSubscriber = await Subscription.create({
        subscriber: userId,
        channel: channelId
    })

    if (newSubscriber) {
        return res.status(200).json(
            new ApiResponse(200, newSubscriber, "subscribed successfully")
        )
    }
})


const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if (!channelId) {
        throw new ApiError(400, "Channel Id is required")
    }

    const subscribers = await Subscription.find({
        channel: channelId
    }).populate("subscriber", 'username email').exec()

    if (!subscribers || !subscribers.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "No subscriber found for this channel"))
    }

    const subscriberDetails = subscribers.map(subscriber => subscriber.subscriber)

    return res.status(200).json(new ApiResponse(200, subscriberDetails, "Subscribers retrieved successfully"));

})

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!subscriberId) {
        throw new ApiError(400, "Subscriber id is required")
    }

    const subscriptions = await Subscription.find({
        subscriber: subscriberId
    }).populate("channel", "username email").exec()

    if (!subscriptions || !subscriptions.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "You have not subscribed to any channel"))
    }

    const subscribedChannels = subscriptions.map(channel => channel.channel)

    return res.status(200).json(new ApiResponse(200, subscribedChannels, "You have subscribed to these channel successfully"));

})


export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}