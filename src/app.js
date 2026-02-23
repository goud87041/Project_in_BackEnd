import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()





// import cors from "cors";

app.use(cors({
  origin: "https://front-end-project-for-back-end-l2iz.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

// app.options("*", cors({
//   origin: "https://front-end-project-for-back-end-l2iz.vercel.app",
//   credentials: true
// }));



app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

// routes
import userRouter from "./routes/user.Routes.js"
import tweetRouter from "./routes/tweet.Routes.js"
import videoRouter from "./routes/video.Routes.js"
import commentRouter from "./routes/comment.Routes.js"
import likeRouter from "./routes/like.Routes.js"
import playList from "./routes/playList.Routes.js"
import helthCheck from "./routes/helthCheck.Routes.js"
import subscribe from "./routes/subscription.Routes.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comment", commentRouter)
app.use("/api/v1/like", likeRouter)
app.use("/api/v1/playList", playList)
app.use("/api/v1/helthCheck",helthCheck)
app.use("/api/v1/subscribe",subscribe)

export { app }
