import mongoose, { isValidObjectId } from "mongoose"
import { PlayList } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiRespone.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { json } from "express"  


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    const userId = req.user?._id
    // const videoId = req.params
    //TODO: create playlist

    if (!userId) {
        throw new ApiError(401, "user Not found")
    }

    if (!name || !description) {
        throw new ApiError(400, " name or description are required")
    }

    const playList = await PlayList.create({
        name,
        description,
        onwer: userId
    })

    return res.status(201).json(
        new ApiResponse(
            201,
            playList,
            "playlist create Successfully"
        )
    )

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const  userId  = req.user?._id
    //TODO: get user playlists

    if (!userId) {
        throw new ApiError(401, "anauthorized user")
    }

    const getPlayLists = await PlayList.find(
        {
            onwer: userId,
        }
    )

    console.log(getPlayLists);
    

    return res.status(202).json(
        new ApiResponse(
            202,
            getPlayLists,
            "play lists are featched"
        )
    )

})

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playListId } = req.params
  const user = req.user?._id

  if (!user) {
    throw new ApiError(401, "unauthorized request")
  }

  if (!playListId) {
    throw new ApiError(400, "playlist id is required")
  }

  const playList = await PlayList.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(playListId),
        onwer: new mongoose.Types.ObjectId(user)
      }
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",   // ✅ array in playlist
        foreignField: "_id",    // ✅ _id in videos
        as: "videos"
      }
    }
  ])

  if (playList.length === 0) {
    throw new ApiError(404, "playlist not found")
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      playList[0], // return single playlist
      "playlist fetched successfully"
    )
  )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    const user = req.user?._id

    if (!user) {
        throw new ApiError(401, "unauthorized user")
    }

    if (!playlistId || !videoId) {
        throw new ApiError(400, "playListId or VideoId not found")
    }

    const playList = await PlayList.findByIdAndUpdate(
        {
            _id: playlistId,
            owner: user
        },
        {
            $addToSet: {
                videos: videoId
            }
        },
        { new: true }
    )

    if (!playList) {
        throw new ApiError(404, "play List not found or access denied")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            playList,
            "add video in play List successfully"
        )
    )

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist

    const user = req.user?._id

    if (!user) {
        throw new ApiError(404, "unauthorized user")
    }

    if (!playlistId || !videoId) {
        throw new ApiError(400, "play List or video not found ")
    }

    const playList = await PlayList.findOneAndUpdate(
        {
            _id: playlistId,
            videos : videoId
        },
        {
            $pull: { videos: videoId }
        },
        { new: true }
    )

    if (!playList) {
        return new ApiError(402, "PlayList not found")
    }

    return res.status(200).json(
        201,
        playList,
        "remove video from the play list successfully"
    )

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playListId } = req.params
    // TODO: delete playlist
    const user = req.user?._id

    if (!user) {
        throw new ApiError(404, "unauthorized user")
    }

    if (!playListId) {
        throw new ApiError(400, "playList is missing")
    }

    const deletePlaylist = await PlayList.findOneAndDelete(
        {
            _id: playListId,
            onwer: user
        }
    )

    // if (!deletePlaylist) {
    //     throw new ApiError(401, "playList not found or access denied")
    // }


    return res.status(201).json(
        201,
        deletePlaylist,
        "remove play list successfully"
    )

})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playListId } = req.params
    const { name, description } = req.body
    //TODO: update playlist

    const user = req.user?._id;

    if (!user) {
        throw new ApiError(401, "unauthorized user")
    }

    console.log(req.params);
    

    console.log("name",name + "description" , description );
    

    if(!playListId || !name || !description){
        throw new ApiError(400 ,"playList , name or description is required")
    }

    const updtPlayList = await PlayList.findByIdAndUpdate(
        {
            _id : playListId,
            onwer : user
        },
        {
            name ,
            description
        },
        {new : true}
    )


    if(!updtPlayList){
        throw new ApiError(402,"play List Not found or Access denied")
    }


    return res.status(200).json(
        200,
        updtPlayList,
        "play list updated successfully"
    )

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}