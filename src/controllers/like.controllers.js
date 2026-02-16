
import mongoose, {isValidObjectId} from "mongoose"
// import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiRespone.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { LikeBy } from "../models/likes.model.js"
// import { Comment } from "../models/comments.model.js"

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
        likeBy : userId
    })

    if(exsistingLike){
        await LikeBy.findOneAndDelete({_id : exsistingLike._id})

        return res
                .status(201)
                .json(new ApiResponse(201 , {Liked : false} ,"video unLike Successfully"))
    }else{
        await LikeBy.create({
            video : videoId,
            likeBy : userId
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
        likeBy : userId
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
            likeBy : userId,
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
        likeBy : userId
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
            likeBy : userId,
            tweet : tweetId
        })

        return res
                .status(201)
                .json(new ApiResponse(201, {liked : true},"like Tweet successfully"))
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(404, "unauthorized request");
    }

    const allLikedVideo = await LikeBy.find({
        likeBy: userId,
        video: { $ne: null }   // fixed
    })
    .populate({
        path: "video",
        populate: {
            path: "owner",
            select: "username fullName avtar"
        }
    })
    .sort({ createdAt: -1 });

    const filteredVideos = allLikedVideo.filter(
    item => item.video !== null
);

    // ✅ If no liked videos found
    if (!filteredVideos || filteredVideos.length === 0) {
        return res.status(200).json(
            new ApiResponse(
                200,
                null,
                "No liked videos found"
            )
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            filteredVideos,
            "All liked videos fetched successfully"
        )
    );
});


export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
