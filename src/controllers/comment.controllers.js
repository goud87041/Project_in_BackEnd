import { Comment } from "../models/comments.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiRespone.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    if (!videoId) {
        throw new ApiError(404, "video not foundr")
    }

    const skip = (Number(page) - 1 * Number(limit))

    const comments = await Comment
        .find({ video: videoId })
    skip(skip)
        .sort({ createAt: -1 })
        .populate("User", "userName avtar")

    const totalComments = await Comment.countDocuments({ video: videoId })

    return res
        .status(200)
        .json(
            new ApiResponse(200, { comments, currentPage: Number(page), totalPage: Math.ceil(totalComments / limit) }, "commets featch successfully")
        );



})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { commentText } = req.body
    const {videoId} = req.params
    const userId = req.user?._id

    if (!commentText || !videoId || !userId) {
        throw new ApiError(500, "required data are missing")
    }

    const comment = await Comment
        .create(
            {
                commentText,
                video :videoId,
                user :userId
            })

    if (!comment) {
        throw new ApiError(404, "Faild to add comment")
    }

    return res
        .status(201)
        .json(new ApiResponse(201, comment, "add Comment successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment

    const {commentText} = req.body
    const {commentId} = req.params
    const userId = req.user?._id

    if(!commentId || !commentText ){
        throw new ApiError(404 ,"required Data is missing")
    }

    const upComment = await Comment.findOneAndUpdate(
        {_id : commentId , user : userId},
        {$set : {commentText}},
        { new : true}
    )

    if(!upComment){
        throw new ApiError(500 ,"comment not found or not Authorized")
    }

    return res
    .status(201)
    .json(new ApiResponse(201 , upComment ,"update Comment Successfully"))



})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const {commentId} = req.params 
    const { userId } = req.user?._id

    const comment = await Comment.findOneAndDelete(
        {
            _id : commentId,
            user : userId
        }
    )

    if(!comment ){
        throw new ApiError(504 ,"comment not found or Unauthorized")
    }

    return res
            .status(203)
            .json(new ApiResponse(203 , {}, "comment delete sucessfully"))
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}
