import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweets.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
// import {ApiResponse} from "../utils/ApiResponse.js"
import { ApiResponse } from "../utils/ApiRespone.js"

import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body

    const user = req.user?._id
    console.log(content);
    

    if(!user){
        throw new ApiError(401,"unauthorized request")
    }
    if(!content){
        throw new ApiError(400,"content required")
    }

    const createtweet = await Tweet.create({
        owner : user,
        content 
    })

    if(!createtweet){
        throw new ApiError(401,"create tweet not found or access denied ")
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            createtweet,
            "tweet create successfully"
        )
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    // const {tweetId} = req.params
    const user = req.user?._id

    if(!user){
        throw new ApiError(401 , "unauthoried user")
    }

    // if(!tweetId){
    //     throw new ApiError(400,"tweet is not found ")
    // }

    const userTweet = await Tweet.find(
        {
            owner : user,
            // _id : tweetId
        }
    )

    if(!userTweet){
        throw new ApiError(404,"user tweet  not found or access denied")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            userTweet,
            "get user Tweet SuccessFully"
        )
    )

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet

   const  { content }  = req.body

   const user = req.user?._id
   const tweetId  = req.params

   if(!user){
        throw new ApiError(401 , "unauthoried user")
    }

    if(!content || !tweetId){
        throw new ApiError(400,"tweet contend required or tweet Id required ")
    }

    const updtTweet = await Tweet.findOneAndUpdate(
        {
            _id : tweetId,
            owner : user
        },
        {
            content
        },
        { new : true }
    )

    if(!updtTweet){
        throw new ApiError(404 , "updt Tweet unsuccessFul")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            updtTweet,
            "user Tweet Updated"
        )
    )


})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const owner = req.user?._id
    const {tweetId} = req.params

    if(!owner){
        throw new ApiError(401 , "unauthoried user")
    }

    if(!tweetId){
        throw new ApiError(400,"tweet Id required ")
    }

    const deletedTweet = await Tweet.findOneAndDelete(
        {
            owner,
            _id : tweetId
        }
    )

    if(!tweetId){
        throw new ApiError(401,"tweet can't delete or access denied")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "tweet DElETE successfully"
        )
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}