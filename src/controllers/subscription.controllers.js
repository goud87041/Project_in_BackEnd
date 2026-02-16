import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import {Subscription} from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiRespone.js"
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
                true,
                "subscribe this channel successfully"
            )
        )
    } else {
        await Subscription.findOneAndDelete({
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
  const userId = req.user?._id

  if (!userId) {
    throw new ApiError(401, "Unauthorized user")
  }

  const subscribedChannels = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(userId)
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "channel",
        as: "channel"
      }
    },
    {
      $unwind: "$channel"
    },
    {
      $project: {
        _id: 1,
        createdAt: 1,
        channel: {
          _id: "$channel._id",
          username: "$channel.userName",
          email: "$channel.email",
          avtar: "$channel.avtar"
        }
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    }
  ])

  if (!subscribedChannels.length) {
    throw new ApiError(404, "No subscribers channel found")
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      subscribedChannels,
      "Subscribers channel fetched successfully"
    )
  )
})


// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {

  const user = req.user?._id;

  if (!user) {
    throw new ApiError(401, "unauthorized user");
  }

  const SubscribedList = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(user)
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",   // ✅ FIXED
        foreignField: "_id",
        as: "channelInfo"
      }
    },
    {
      $unwind: "$channelInfo"
    },
    {
      $project: {
        _id: 1,
        channelId: "$channelInfo._id",
        username: "$channelInfo.userName",
        avtar: "$channelInfo.avtar" // ✅ FIXED (or avtar if schema uses it)
      }
    }
  ]);

  if (SubscribedList.length === 0) {
    throw new ApiError(404, "subscribers not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      SubscribedList,
      "subscribers fetched successfully"
    )
  );
});


export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}