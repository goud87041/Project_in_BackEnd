import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    if(!userId ){
        throw new ApiError(402,"unauthorized user")
    }

    const allVideos = await Video.aggregate([
        {
            $match :{
                owner : new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup :{
                from : "users",
                localField : "owner" ,
                foreignField : "_id",
                as : "ownerDetails"
            }
        },
        {
            $project :{
                _id :1,
                "ownerDetails.thumbnail" : 1,
                "ownerDetails.duration" : 1,
                "ownerDetails.username" : 1,
                "ownerDetails.views" : 1
            }
        },
        {
            $sort : {
                createdAt : -1
            }
        }
    ])

    if(allVideos.length == 0){
        throw new ApiError(401,"videos are not fount")
    }

    return res.status(201).status(
        new ApiResponse(
            201,
            allVideos,
            "all videos featch successfully"
        )
    )
})
   
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    const file = req.file
    const user = req.user?._id

    if(!user){
        throw new ApiError(401,"unauthoriezd user")
    }

    if(!file){
        throw new ApiError(402,"video file not found")
    }

    const uploadVideoOnCloudinary = await uploadOnCloudinary(file)

    const publishVideo = await Video.create({
        videoFile : uploadVideoOnCloudinary.url,
        owner : user,
        title,
        description
    })

    if(!publishVideo){
        throw new ApiError(401,"something went wrong when uploading video")
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            null,
            "video upload successfully"
        )
    )

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const user = req.user?._id

    if(!user){
        throw new ApiError(401,"unauthorized user")
    }

    const findVideo = await Video.findById(
        {
            owner : user,
            _id : videoId
        },
        {
            view,
            
        }
    )

    if(!findVideo){
        throw new ApiError(401,'video not found')
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            findVideo,
            "video featch successfully "
        )
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const { title, description,thumbnail} = req.body
    const user = req.user?._id

    if(!user ){
        throw new ApiError(401,"unauthorized user")
    }

    const updatedVideo = await Video.findOneAndUpdate(  
        {
            _id : videoId,
            owner : user
        },
        {
            title,
            description,
            thumbnail
        },
        {new : true}
)

    if(!updatedVideo){
        throw new ApiError(402,"something went wrong while updated details ")
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            updatedVideo,
            "details are update successfully"
        )
    )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    const user = req.user?._id

    if(!user){
        throw new ApiError(402,"unauthorized user")
    }

    const videoDelete = await Video.findOneAndDelete(
        {
            _id : videoId,
            owner : user
        }
    )

    if(!videoDelete){
        throw new ApiError(402,"video is not deleted")
    }

    return res.status(201).json(
        new ApiError(
            201,
            {},
            "video has deleted successfully"
        )
    )

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const user = req.user?._id

    if(!user){
        throw new ApiError(402,"unauthorized user")
    }

    if(!videoId){
        throw ApiError(404, "video not found")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw ApiError(404, " video not found in DB")
    }

    // const isPublishStatusActive = Video.findById()

    video.isPublish = !video.isPublish
    await Video.bulkSave({validateBeforeSave : false})

    return res.status(201)
    .json(
        new ApiResponse(
            201,
            video,
            `video ${video.isPublish ? " published " :"unPublished"} successfully`
        )
    )

})


export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}