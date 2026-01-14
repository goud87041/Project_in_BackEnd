import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
// import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiRespone.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinari.js"
import { log } from "console"

  
const getAllVideos = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        query,
        sortBy = "createdAt",
        sortType = "desc",
        // user
    } = req.query

    const user = req.user?._id

    console.log(user);
    

    if (!user) {
        throw new ApiError(401, "Unauthorized user")
    }

    const matchStage = {
        owner: new mongoose.Types.ObjectId(user)
    }

    // 🔍 search by title or description
    if (query) {
        matchStage.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ]
    }

    const sortStage = {
        [sortBy]: sortType === "asc" ? 1 : -1
    }

    const skip = (Number(page) - 1) * Number(limit)

    const allVideos = await Video.aggregate([
        { $match: matchStage },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails"
            }
        },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                thumbnail: 1,
                duration: 1,
                views: 1,
                createdAt: 1,
                "ownerDetails.username": 1,
                "ownerDetails.avatar": 1
            }
        },
        { $sort: sortStage },
        { $skip: skip },
        { $limit: Number(limit) }
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            allVideos,
            "All videos fetched successfully"
        )
    )
})

   
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    const user = req.user?._id

    if (!user) {
        throw new ApiError(401, "Unauthorized user")
    }

    
    const videoFile = req.files?.videoFile[0]?.path
    const thumbnailFile = req.files?.thumbnail[0]?.path
    
    console.log("req  video file in video controller : " , videoFile);
    if (!videoFile) {
        throw new ApiError(400, "Video file is required")
    }

    if (!thumbnailFile) {
        throw new ApiError(400, "Thumbnail is required")
    }  

    const uploadedVideo = await uploadOnCloudinary(videoFile)
if (!uploadedVideo) {
    throw new ApiError(500, "Video upload failed")
}

const uploadedThumbnail = await uploadOnCloudinary(thumbnailFile)
console.log(uploadedThumbnail);

if (!uploadedThumbnail) {
    throw new ApiError(500, "Thumbnail upload failed")
}

    const video = await Video.create({
        videoFile: uploadedVideo.url,
        thumbnail: uploadedThumbnail.url,
        owner: user,
        title,
        description, // schema spelling
        duration: uploadedVideo?.duration || 0,
        isPublish: true
    })

    return res.status(201).json(
        new ApiResponse(201, video, "Video uploaded successfully")
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