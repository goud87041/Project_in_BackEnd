import { Router } from "express";

import {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
} from  "../controllers/comment.controllers.js"
// import { verify } from "jsonwebtoken";
import {verifyJWT} from "../middlewares/auth.midware.js"



const router = Router();

router.use(verifyJWT);

router.route('/:videoId').get(getVideoComments).post(addComment)
router.route("/:commentId").delete(deleteComment).patch(updateComment)


export default router