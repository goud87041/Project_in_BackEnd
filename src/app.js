import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

if (process.env.NODE_ENV !== "production") {
    connectDB().then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log("Server running locally");
        });
    });
}

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));



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

app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comment", commentRouter)
app.use("/api/v1/like", likeRouter)
app.use("/api/v1/playList", playList)
app.use("/api/v1/helthCheck",helthCheck)

export { app }
