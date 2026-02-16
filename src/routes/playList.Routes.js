import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.midware.js";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controllers.js";
// import { updateComment } from "../controllers/comment.controllers";

const router = Router()

router.use(verifyJWT)

router.route("/").post(createPlaylist)
router.route("/UserPlayLists").get(getUserPlaylists)

router
    .route("/:playListId") 
    .get(getPlaylistById)  
    .post(updatePlaylist)
    .delete(deletePlaylist)

router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist)
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist)


export default router