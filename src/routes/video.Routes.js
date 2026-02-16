import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.midware.js"
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  getVideos,
  publishAVideo,
  togglePublishStatus,
  updateVideo
} from "../controllers/video.controllers.js"
import { upload } from "../middlewares/multer.midware.js"

const router = Router()

router.use(verifyJWT)

router.route("/")
 
  .post(
    upload.fields([
      { name: "videoFile", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 }
    ]),
    publishAVideo
  )
  .get(getVideos)

  router.route("/allVideos")
  .get(getAllVideos)

router.route("/:videoId")
 
  .get(getVideoById)
  .delete(deleteVideo)
  .patch(upload.single("thumbnail"), updateVideo)

router.route("/toggle/publish/:videoId")
  .patch(togglePublishStatus)

export default router
