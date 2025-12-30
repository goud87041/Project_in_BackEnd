import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.midware";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controllers";

const router = Router();

router.use(verifyJWT)

router.route("/toggel/v/:videoId").post(toggleVideoLike)
router.route("/toggel/c/:commentId").post(toggleCommentLike)
router.route("/toggel/t/:tweetId").post(toggleTweetLike)
router.route("/videos").get(getLikedVideos)

export default router