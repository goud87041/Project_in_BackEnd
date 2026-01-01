import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { subscription, Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription

    const currentUser = req.user?._id

    if(!currentUser){
        throw new ApiError(401, "unauthorzed user")
    }

    if(!channelId){
        throw new ApiError(400,"channel not found")
    }

    const isSubscribe = await Subscription.findOne({
        channel : channelId,
        subscriber : currentUser
    })

    if(!isSubscribe){
       await Subscription.create({
            channel : channelId,
            subscriber : currentUser
        })

        return res.status(201).json(
            new ApiResponse(
                201,
                ture,
                "subscriber this channel successfully"
            )
        )
    }else{
        await subscription.findOneAndDelete({
            channel :channelId,
            subscriber :currentUser
        })

        return res.status(201).json(
            new ApiResponse(
                201,
                false,
                "unsubscrib this channel successfully"
            )
        )
    }

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}