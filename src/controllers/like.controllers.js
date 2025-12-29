
import mongoose, {isValidObjectId} from "mongoose"
// import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { LikeBy } from "../models/likes.model.js"
import { Comment } from "../models/comments.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const userId = req.user?._id 
    // Boolean videoLikeToggle = false ;

    if(!userId || !videoId ){
        throw new ApiError(400, "video not found or not Authorized to like")
    }

    // lets create like 
    const exsistingLike = await LikeBy.findOne({
        video : videoId,
        LikeBy : userId
    })

    if(exsistingLike){
        await LikeBy.findOneAndDelete({_id : exsistingLike._id})

        return res
                .status(201)
                .json(new ApiResponse(201 , {Liked : false} ,"video unLike Successfully"))
    }else{
        await LikeBy.create({
            video : videoId,
            LikeBy : userId
        })

        return res
                .status(201)
                .json(new ApiResponse(201,{liked :  true}, "video Liked successfully"))
    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const userId = req.user?._id
    //TODO: toggle like on comment

    if(!userId || !commentId ){
        throw new ApiError(401,"Unauthorized request or invalid comment")
    }

    const isLikeOnCommentExsist = await LikeBy.findOne({
        comment : commentId,
        LikeBy : userId
    })

    if(isLikeOnCommentExsist){
        await LikeBy.findOneAndDelete({
            _id : isLikeOnCommentExsist._id,
        })

        return res
                .status(200)
                .json(new ApiResponse(201,{liked : false}, "unlike comment Successfully"))
    }else{
        await LikeBy.create({
            LikeBy : userId,
            comment : commentId
        })

        return res
                .status(201)
                .json(new ApiResponse(201,{liked : true},"liked On comment Successfully"))
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

    const userId = req.userId?._id

    const isLikeExistOnTweet = await LikeBy.findOne({ 
        tweet : tweetId,
        LikeBy : userId
    })

    if(isLikeExistOnTweet){
        await LikeBy.findOneAndDelete({
            _id : isLikeExistOnTweet._id
        })

        return res
                .status(200)
                .json(new ApiResponse(200, {liked : false},"unlike tweet Successfully"))
    }else{
        await LikeBy.create({
            LikeBy : userId,
            tweet : tweetId
        })

        return res
                .status(201)
                .json(new ApiResponse(201, {liked : ture},"like Tweet successfully"))

    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const userId = req.user?._id

    if(!userId){
        throw new ApiError(404, "unauthorized request")
    }

    const allLikedVideo = await LikeBy.find({
            likeBy : userId,
            video : {$ne : null}
    })
    .populate({
        path : "video",
        populate : {
            path: "owner",
            select : "username fullName avtar"
        }
    })
    .sort(
        {
            createdAt : -1
        }
    )

    return res
            .status(200)
            .json(200,{allLikedVideo},"all Liked Video featch successfully")


})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
