import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.midware.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controllers.js";

const router = Router()

router.route("/subscribed-channels")
  .get(verifyJWT, getSubscribedChannels)

router.route("/subscribers")
  .get(verifyJWT, getUserChannelSubscribers)

router.route("/:channelId")
  .get(verifyJWT, toggleSubscription)

 
export default router 