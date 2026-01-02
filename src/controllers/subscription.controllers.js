import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { subscription, Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    // TODO: toggle subscription

    const currentUser = req.user?._id

    if (!currentUser) {
        throw new ApiError(401, "unauthorzed user")
    }

    if (!channelId) {
        throw new ApiError(400, "channel not found")
    }

    const isSubscribe = await Subscription.findOne({
        channel: channelId,
        subscriber: currentUser
    })

    if (!isSubscribe) {
        await Subscription.create({
            channel: channelId,
            subscriber: currentUser
        })

        return res.status(201).json(
            new ApiResponse(
                201,
                ture,
                "subscriber this channel successfully"
            )
        )
    } else {
        await subscription.findOneAndDelete({
            channel: channelId,
            subscriber: currentUser
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
    const { channelId } = req.params
    const user = req.user?._id

    if (!user) {
        throw new ApiError(401, "unauthorized user ")
    }

    if (!channelId) {
        throw new ApiError(400, "channel id required")
    }

    // const getSubscribersList = await Subscription.aggregate([
    //     {
    //         $match
    //     }
    // ])

    const getSubscribersList = await Subscription.aggregate([
        {
            $match : {
                subscriber : await mongoose.Types.ObjectId(user)
            }
        },
        {
            $lookup :{
                from : "users",
                localField : "channel",
                foreignField : "_id",
                as : "channel"
            }
        },
        {
            $upwind : "$channel"
        },
        {
            $project : {
                _id :1,
                "channel.avtar" : 1,
                "channel.username" :1 ,
                "channel._id" : 1,
                "channel.email" : 1,
                "createdAt" : 1,
            }
        },
        {
            $sort :{
                createAt : -1
            }
        }
    ])

    if (!getSubscribersList.length) {
        throw new ApiError(401, "unable to find the subscribers List")
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            getSubscribersList,
            "Subscribers List featch successfully"
        )
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    const user =   req.user?._id

    if(!user){
        throw new ApiError(404, "unauthorized user")
    }

    
    if(!subscriberId){
        throw new ApiError(404, "subscriberId not found")
    }

    const SubscribedList = await Subscription.aggregate([
        {
            $match :{
                subscriber :new  mongoose.Types.ObjectId(user)
            } 
        },
        {
            $lookup : {
                from : "users",
                localField : "chennal",
                foreignField : "_id",
                as : "subscriber"
            }
        },
        {
            $project :{
                _id : 1,
                "subscriber.username" : 1,
                "subscriber.avtar" : 1
                // "subscriber."
            }
        },
        {
            $sort : {
                createdAt : -1
            }
        }
    ])

    if(SubscribedList.length ==0){
        throw new ApiError(401 ,"subscribers are not found")
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            SubscribedList,
            "subscribers are featch successfully"
        )
    )
    
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}