import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.midware";
import { addVideoToPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controllers";
// import { updateComment } from "../controllers/comment.controllers";

const router = Router()

router.use(verifyJWT)

router.route("/").post("createPlaylist")

router
    .route("/PlayListId")
    .get(getPlaylistById)
    .path(updatePlaylist)
    .delete(deletePlaylist)

router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist)
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist)

router.route("/user/:userId").get(getUserPlaylists)