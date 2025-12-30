import express from "express"
// import cors from "cors"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()


app.use(cors({
    origin : process.env.CORS_ORIGIN ,
    credentials  : true
            
}))

app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended : true ,limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// import routes 

import userRouter from "./routes/user.Routes.js"
import tweetRouter from "./routes/tweet.Routes.js"
// import { createTweet } from "./controllers/tweet.controllers.js"/
// import tweetRouter from "./routes/tweet.Routes.js"


// routes decleration

app.use("/api/v1/users",userRouter)
// app.use("/api/vi",tweetRouter)
app.use("/api/v1/",tweetRouter)

export {app}